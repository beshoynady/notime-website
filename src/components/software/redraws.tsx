/**
 * The federation platform as a stylised redraw (D67): abstract layout blocks in the brand palette
 * (a header, a results table and athlete cards as bars), never the client's screens, name or
 * logo. Decorative: the case study's text carries the facts.
 */
export function RedrawLaptop() {
  return (
    <div className="sw-rd" aria-hidden="true">
      <div className="sw-rd-bar">
        <i className="sw-rd-mark" />
        <i />
        <i />
        <i />
        <i className="sw-rd-lang" />
      </div>
      <div className="sw-rd-hero">
        <i className="sw-rd-h" />
        <i className="sw-rd-h sw-rd-h2" />
        <i className="sw-rd-cta" />
      </div>
      <div className="sw-rd-body">
        <div className="sw-rd-table" data-sw-rows="">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="sw-rd-row">
              <i className="sw-rd-pos" />
              <i className="sw-rd-name" />
              <i className="sw-rd-time" />
            </span>
          ))}
        </div>
        <div className="sw-rd-cards">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="sw-rd-card">
              <i className="sw-rd-photo" />
              <i />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RedrawPhone() {
  return (
    <div className="sw-rd sw-rd-m" aria-hidden="true">
      <div className="sw-rd-bar">
        <i className="sw-rd-mark" />
        <i className="sw-rd-lang" />
      </div>
      <div className="sw-rd-hero">
        <i className="sw-rd-h" />
        <i className="sw-rd-cta" />
      </div>
      <div className="sw-rd-table">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="sw-rd-row">
            <i className="sw-rd-pos" />
            <i className="sw-rd-name" />
            <i className="sw-rd-time" />
          </span>
        ))}
      </div>
      <div className="sw-rd-tabs">
        <i className="is-on" />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
