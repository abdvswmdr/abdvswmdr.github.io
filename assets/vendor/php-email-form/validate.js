/**
* PHP Email Form Validation - v3.9
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      // Ask the server for JSON response. Avoid custom headers that may
      // trigger stricter CORS preflight restrictions.
      headers: {'Accept': 'application/json'}
    })
    .then(response => {
      if (!response.ok) {
        // propagate server error text if available
        return response.text().then(t => { throw new Error(`${response.status} ${response.statusText} ${response.url} ${t}`); });
      }
      // Try to detect JSON response (Formspree returns JSON on success)
      const ct = response.headers.get('content-type') || '';
      if (ct.indexOf('application/json') !== -1) {
        return response.json().then(j => ({__json: true, body: j}));
      }
      return response.text().then(t => ({__json: false, body: t}));
    })
    .then(result => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (result.__json) {
        const j = result.body;
        // Formspree v2 returns { ok: true } on success; check common success signals
        if (j && (j.ok === true || j.success === true)) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
          return;
        }
        // If errors provided, surface them
        const msg = (j && (j.error || j.message || JSON.stringify(j))) || ('Form submission failed for: ' + action);
        throw new Error(msg);
      } else {
        const data = result.body;
        if (typeof data === 'string' && data.trim() === 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
          return;
        }
        // If empty response with 200, treat as success
        if (!data || (typeof data === 'string' && data.trim() === '')) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
          return;
        }
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
