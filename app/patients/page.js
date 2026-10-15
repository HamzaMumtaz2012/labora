import FormShell from '../../components/FormShell';
import PatientRegistrationForm from '../../components/PatientRegistrationForm';

export default function PatientsPage() {
  return (
    <FormShell
      eyebrow="PATIENT RECORDS"
      title="Patient Registration"
      description="Register a patient and record their contact and test details."
      number="01"
    >
      <PatientRegistrationForm />
    </FormShell>
  );
}
