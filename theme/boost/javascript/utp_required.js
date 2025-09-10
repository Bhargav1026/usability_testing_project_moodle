// UTP accessibility: add textual "(Required)" next to labels that only have a red icon.
// Scope: Moodle forms (.mform). Works on course create/edit and other forms.
(function () {
  function enhanceRequiredMarkers(root) {
    var items = root.querySelectorAll('.mform .fitem.row, .mform .form-group');
    items.forEach(function (item) {
      var label = item.querySelector('.col-form-label, .form-label, label');
      var requiredIcon = item.querySelector('.form-label-addon .form-required, .form-required, abbr.required');

      if (label && requiredIcon) {
        // Append a textual cue once
        if (!label.querySelector('.utp-required-text')) {
          var span = document.createElement('span');
          span.className = 'utp-required-text';
          span.textContent = ' (Required)';
          span.style.fontWeight = '600';
          span.style.marginLeft = '0.35rem';
          label.appendChild(span);
        }
      }

      // Add ARIA required to the first form control in the same row.
      var control = item.querySelector('input, select, textarea');
      if (control && requiredIcon) {
        if (!control.getAttribute('aria-required')) control.setAttribute('aria-required', 'true');
        // Reflect in HTML too (non-invasive)
        if (!control.required) try { control.required = true; } catch (e) {}
      }
    });
  }

  // Add helpful placeholder for Calendar "New event" title field.
  // Works for both full page and modal popup versions.
  function setEventTitlePlaceholder(root) {
    try {
      // Common selectors used by Moodle for the event title input
      var candidates = root.querySelectorAll('#id_name, input[name="name"]');
      candidates.forEach(function (el) {
        // Only set if empty to avoid overriding site-localized placeholders
        if (!el.getAttribute('placeholder') || el.getAttribute('placeholder').trim() === '') {
          el.setAttribute('placeholder', 'Please enter your event title (e.g., Birthday, Meeting)');
        }
      });
    } catch (e) { /* no-op */ }
  }

  // Add textual labels to calendar events so color isn't the only cue
  // Handles classic classes (.calendar_event_course/user/group/site) and generic calendar event containers.
  function enhanceCalendarEventLabels(root) {
    var selectors = [
      '.calendar_event_course',
      '.calendar_event_user',
      '.calendar_event_group',
      '.calendar_event_site',
      '.calendar .calendar-event',
      '.calendar .event'
    ].join(',');

    var events = root.querySelectorAll(selectors);
    events.forEach(function (ev) {
      // Determine event type from classes or data attributes
      var type = '';
      var cls = (ev.className || '');
      var ds  = ev.dataset || {};
      var dt  = ds.eventtype || ds.eventType || ev.getAttribute('data-eventtype') || ev.getAttribute('data-event-type') || '';

      if (cls.indexOf('calendar_event_course') !== -1 || /(^|\s)course(\s|$)/i.test(dt)) {
        type = 'Course';
      } else if (cls.indexOf('calendar_event_user') !== -1 || /(^|\s)user(\s|$)/i.test(dt)) {
        type = 'User';
      } else if (cls.indexOf('calendar_event_group') !== -1 || /(^|\s)group(\s|$)/i.test(dt)) {
        type = 'Group';
      } else if (cls.indexOf('calendar_event_site') !== -1 || /(^|\s)site(\s|$)/i.test(dt)) {
        type = 'Site';
      }

      if (!type) return;

      // Find a good anchor to append the label (prefer the event name/link)
      var anchor = ev.querySelector('.eventname, .name, a, .calendar-event-link') || ev;

      // Only add once
      if (!anchor.querySelector('.utp-event-type')) {
        var badge = document.createElement('span');
        badge.className = 'utp-event-type';
        badge.textContent = ' (' + type + ')';
        badge.style.fontSize = '0.8em';
        badge.style.fontWeight = '600';
        badge.style.marginLeft = '0.35rem';
        badge.style.color = '#555';
        anchor.appendChild(badge);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      enhanceRequiredMarkers(document);
      setEventTitlePlaceholder(document);
      enhanceCalendarEventLabels(document);
    });
  } else {
    enhanceRequiredMarkers(document);
    setEventTitlePlaceholder(document);
    enhanceCalendarEventLabels(document);
  }

  // Watch for dynamically added form sections and enhance them too.
  var obs = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) {
            enhanceRequiredMarkers(n);
            setEventTitlePlaceholder(n);
            enhanceCalendarEventLabels(n);
          }
        });
      }
    });
  });
  try { obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
})();