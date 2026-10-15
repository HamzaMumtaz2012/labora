import getMongoClient from '../../../lib/mongodb.js';

function exactCaseInsensitiveMatch(value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escapedValue}\\s*$`, 'i');
}

export async function POST(request) {
  let patient;

  try {
    patient = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!patient || typeof patient !== 'object' || Array.isArray(patient)) {
    return Response.json({ error: 'Request body must be a patient object.' }, { status: 400 });
  }

  const allowedFields = [
    'patientName',
    'dateOfBirth',
    'gender',
    'phone',
    'email',
    'address',
    'registrationDate',
    'doctor',
    'service',
    'testCode',
    'status',
  ];
  patient = Object.fromEntries(
    Object.entries(patient).filter(([field]) => allowedFields.includes(field))
  );

  const requiredFields = ['patientName', 'gender', 'phone', 'registrationDate'];
  const missingFields = requiredFields.filter(
    (field) => typeof patient[field] !== 'string' || !patient[field].trim()
  );

  if (missingFields.length > 0) {
    return Response.json(
      { error: `Missing required patient fields: ${missingFields.join(', ')}.` },
      { status: 400 }
    );
  }

  patient.patientName = patient.patientName.trim();
  patient.phone = patient.phone.trim();
  if (typeof patient.email === 'string') {
    patient.email = patient.email.trim();
    if (!patient.email) delete patient.email;
  }

  try {
    const client = await getMongoClient();
    const patients = client.db('Labora').collection('Patients');
    const duplicateConditions = [
      { patientName: exactCaseInsensitiveMatch(patient.patientName) },
      { phone: patient.phone },
    ];

    if (patient.email) {
      duplicateConditions.push({ email: exactCaseInsensitiveMatch(patient.email) });
    }

    const existingPatients = await patients
      .find({ $or: duplicateConditions })
      .project({ patientName: 1, phone: 1, email: 1 })
      .toArray();
    const duplicateFields = new Set();

    for (const existingPatient of existingPatients) {
      if (
        existingPatient.patientName?.trim().toLowerCase() ===
        patient.patientName.toLowerCase()
      ) {
        duplicateFields.add('name');
      }
      if (existingPatient.phone?.trim() === patient.phone) {
        duplicateFields.add('phone number');
      }
      if (
        patient.email &&
        existingPatient.email?.trim().toLowerCase() === patient.email.toLowerCase()
      ) {
        duplicateFields.add('email');
      }
    }

    if (duplicateFields.size > 0) {
      const fields = [...duplicateFields];
      return Response.json(
        {
          error: `A patient with this ${fields.join(' and ')} already exists.`,
          duplicateFields: fields,
        },
        { status: 409 }
      );
    }

    const result = await patients.insertOne(patient);

    return Response.json(
      { message: 'Patient created', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to save patient:', error);
    const isConfigurationError =
      error instanceof Error && error.message.startsWith('Missing mongoDbUri');

    return Response.json(
      {
        error: isConfigurationError
          ? 'Patient database is not configured. Set mongoDbUri in .env.local and restart the server.'
          : 'Could not save patient. Check the server’s MongoDB connection and try again.',
      },
      { status: isConfigurationError ? 503 : 500 }
    );
  }
}
