import { version } from '../../package.json'

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="version">Version {version}</p>
        </div>

        <div className="footer-section">
          <p className="credits">
            Created with ♥ by{' '}
            <a
              href="https://github.com/narqulie"
              target="_blank"
              rel="noopener noreferrer"
            >
              Narqulie
            </a>
          </p>
        </div>

        <div className="footer-section">
          <a
            href="https://www.paypal.me/jheaminoff"
            target="_blank"
            rel="noopener noreferrer"
            className="support-link"
          >
            <img
              src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💶</text></svg>"
              alt="Support this project"
            />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
