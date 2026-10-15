import FormShell from '../../components/FormShell';
import PatientRegistrationForm from '../../components/PatientRegistrationForm';
import getMongoClient from '../../lib/mongodb.js';

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  let tests = [];
  let testsError = '';

  try {
    const client = await getMongoClient();
    const records = await client
      .db('Labora')
      .collection('Tests')
      .find(
        {},
        { projection: { _id: 0, testName: 1, testCode: 1, doctorName: 1 } }
      )
      .sort({ testName: 1 })
      .toArray();

    tests = records
      .filter((test) => typeof test.testName === 'string' && test.testName.trim())
      .map((test) => ({
        testName: test.testName,
        testCode: typeof test.testCode === 'string' ? test.testCode : '',
        doctorName: typeof test.doctorName === 'string' ? test.doctorName : '',
      }));
  } catch (error) {
    console.error('Failed to load tests:', error);
    testsError = 'Could not load tests from the database. Check the MongoDB connection and Tests collection.';
  }

  return (
    <FormShell
      eyebrow="PATIENT RECORDS"
      title="Patient Registration"
      description="Register a patient and record their contact and test details."
      number="01"
    >
      <PatientRegistrationForm tests={tests} testsError={testsError} />
    </FormShell>
  );
}
