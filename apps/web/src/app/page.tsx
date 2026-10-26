import Link from 'next/link';

const writingSteps = [
  [
    '01',
    'The problem',
    'What broke, what mattered, and the constraints around it.',
  ],
  [
    '02',
    'The implementation',
    'The decisions, trade-offs, and code that shaped the solution.',
  ],
  [
    '03',
    'The lessons',
    'The surprises and mistakes worth remembering next time.',
  ],
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header" id="top">
        <div className="site-shell header-inner">
          <Link className="wordmark" href="/" aria-label="Ruby Liang home">
            <span className="wordmark-mark" aria-hidden="true">
              r.
            </span>
            <span>Ruby Liang</span>
          </Link>
          <nav className="primary-nav" aria-label="Primary navigation">
            <a href="#top" aria-current="page">
              Home
            </a>
            <a href="#writing">Writing</a>
            <a href="#notes">Notes</a>
            <a href="#about">About</a>
          </nav>
          <span className="header-label">ENGINEERING NOTEBOOK</span>
        </div>
      </header>

      <main id="main">
        <section className="hero site-shell" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              SOFTWARE · SYSTEMS · APPLIED AI
            </p>
            <h1 id="page-title">
              Hey, I&apos;m Ruby.
              <span> I write to understand how things work.</span>
            </h1>
            <p className="hero-description">
              A personal space for the problems I solve, the systems I build,
              and the ideas I keep coming back to. Here, the process matters as
              much as the result.
            </p>
            <a className="primary-link" href="#writing">
              Explore the notebook <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-grid" />
            <span className="art-index">FIELD NOTES / 001</span>
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <div className="art-core">R</div>
            <span className="art-caption">Observe. Build. Reflect.</span>
          </div>
        </section>

        <section className="writing-section section-block" id="writing">
          <div className="site-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker">01 / TECHNICAL BLOG</p>
                <h2>Writing from the work.</h2>
              </div>
              <p>
                Clear accounts of real problems, from first investigation to the
                final takeaway.
              </p>
            </div>
            <div className="writing-layout">
              <div className="empty-writing">
                <span className="empty-writing-symbol" aria-hidden="true">
                  ✳
                </span>
                <div>
                  <p className="empty-label">LATEST WRITING</p>
                  <h3>The first article is on its way.</h3>
                  <p>
                    I&apos;m turning working notes into useful, readable
                    stories. Published articles will appear here.
                  </p>
                </div>
              </div>
              <div className="writing-method" aria-label="Article structure">
                {writingSteps.map(([number, title, description]) => (
                  <div className="method-row" key={number}>
                    <span>{number}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="notes-section section-block" id="notes">
          <div className="site-shell notes-layout">
            <div>
              <p className="section-kicker">02 / COURSE NOTES</p>
              <h2>Learning, connected.</h2>
              <p className="notes-description">
                Course notes will live in topic-based series, with a clear
                outline and a path from one chapter to the next. A place to
                connect the details into a bigger picture.
              </p>
              <span className="coming-soon">Series are being prepared</span>
            </div>
            <div className="notes-diagram" aria-hidden="true">
              <span className="diagram-label">
                A BETTER WAY TO REVISIT IDEAS
              </span>
              <div className="diagram-row">
                <span>Topic</span>
                <span className="diagram-line" />
                <span>Chapter</span>
                <span className="diagram-line" />
                <span>Insight</span>
              </div>
              <span className="diagram-footer">
                ONE IDEA LEADS TO THE NEXT ↗
              </span>
            </div>
          </div>
        </section>

        <section className="about-section section-block site-shell" id="about">
          <div>
            <p className="section-kicker">03 / ABOUT</p>
            <h2>A little about me.</h2>
          </div>
          <div className="about-copy">
            <p>
              I&apos;m Ruby Liang, a computer science graduate exploring
              full-stack software, systems, and applied AI. I like work that
              asks me to understand the whole problem, not just the next line of
              code.
            </p>
            <p>
              This notebook is where I make that thinking visible: what I tried,
              why I chose it, and what I&apos;d do differently.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-inner">
          <span>© {new Date().getFullYear()} Ruby Liang</span>
          <span>Built with curiosity, one note at a time.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
