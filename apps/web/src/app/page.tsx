import Link from 'next/link';

const areas = [
  {
    number: '01',
    title: 'Technical writing',
    description:
      'The problem, the decisions, and what I learned along the way.',
  },
  {
    number: '02',
    title: 'Course notes',
    description:
      'Connected ideas. Small examples. A little more understanding each time.',
  },
  {
    number: '03',
    title: 'About me',
    description:
      'A computer science graduate exploring software, systems, and applied AI.',
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="Ruby Liang home">
            ruby<span>.</span>
          </Link>
          <span className="header-note">A PERSONAL ENGINEERING NOTEBOOK</span>
          <a className="header-link" href="#notebook">
            Explore the notebook <span aria-hidden="true">↘</span>
          </a>
        </header>
        <main id="main">
          <section className="hero" aria-labelledby="page-title">
            <p className="eyebrow">
              <span className="status-dot" /> NOTES IN PROGRESS
            </p>
            <h1 id="page-title">
              Building things.
              <br />
              <em>Understanding</em>
              <br />
              how they work.
            </h1>
            <div className="hero-bottom">
              <p>
                A space for the questions, experiments, and small discoveries
                behind my work in software and systems.
              </p>
              <span className="signature">
                Ruby Liang <span aria-hidden="true">↗</span>
              </span>
            </div>
          </section>
          <section
            id="notebook"
            className="notebook"
            aria-labelledby="notebook-title"
          >
            <div className="section-heading">
              <h2 id="notebook-title">Inside the notebook</h2>
              <span>THE FIRST CHAPTER</span>
            </div>
            <div className="areas">
              {areas.map((area) => (
                <article key={area.number} className="area">
                  <span className="area-number">{area.number}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              ))}
            </div>
            <p className="publication-note">
              The notebook is taking shape. Articles and course notes will
              appear here as they are published.
            </p>
          </section>
        </main>
        <footer>
          <span>Thoughtfully built, one step at a time.</span>
          <span>SOFTWARE / SYSTEMS / AI</span>
        </footer>
      </div>
    </>
  );
}
