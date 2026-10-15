import Link from 'next/link';

const sections = [
  {
    href: '/patients',
    icon: '♙',
    title: 'Patient registration',
    description: 'Register patients, select tests, and record referring doctor details.',
    action: 'Register a patient',
  },
  {
    href: '/employees',
    icon: '♧',
    title: 'Employee registration',
    description: 'Add staff contact, role, and employment information.',
    action: 'Register an employee',
  },
  {
    href: '/services',
    icon: '⚗',
    title: 'Products & services',
    description: 'Manage laboratory tests, service pricing, and inventory details.',
    action: 'Manage services',
  },
];

export default function Home() {
  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">LABORA MANAGEMENT</div>
          <h1>Welcome to Labora</h1>
          <p>Choose a section to manage your laboratory records.</p>
        </div>
        <div className="user-chip">
          <span className="avatar">L</span>
          <span><strong>Laboratory</strong><small>Management portal</small></span>
        </div>
      </header>
      <section className="home-grid" aria-label="Laboratory management sections">
        {sections.map((section) => (
          <Link className="home-card" href={section.href} key={section.href}>
            <span className="home-card-icon" aria-hidden="true">{section.icon}</span>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <span className="home-card-action">{section.action} <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>
      <footer className="footer">
        <span>© 2026 <strong>Labora</strong> · Laboratory management</span>
        <span>Management portal</span>
      </footer>
    </>
  );
}
