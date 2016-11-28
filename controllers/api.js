let express = require('express'),
  router = express.Router(),
  fs = require('fs');

let loadSpeakers = (() => {
  let list = JSON.parse(fs.readFileSync('data/speakers.json', 'utf8')),
    speakers = list.speakers,
    currentSpeakers = [];

  return {
    getSpeakers: speakers,
    getCurrentSpeakers: speakers.filter((s) => s.current),
    getSpeakerByName(name) {
      return speakers.find(s => s.link === name);
    }
  }
})();

let loadEvents = (() => {
  let events = JSON.parse(fs.readFileSync('data/events.json', 'utf8')).events;
  events.forEach(event => {
    let speakers = [];
    event.speakers.forEach(speaker => {
      speakers.push(loadSpeakers.getSpeakerByName(speaker));
    });
    event.speakers = speakers;
  });

  return {
    getEvents: events,
    getCurrentEvent: events[0],
    getEventBySlug(link) {
      return events.find(s => s.link === link);
    }
  }
})();

router.get('/palestrantes', (req, res) => {
  res.json(loadSpeakers.getSpeakers);
});

router.get('/palestrante/:link', (req, res) => {
  res.json(loadSpeakers.getSpeakerByName(req.params.link));
});

router.get('/eventos', (req, res) => {
  res.json(loadEvents.getEvents);
});

router.get('/evento/:link', (req, res) => {
  res.json(loadEvents.getEventBySlug(req.params.link));
});

router.get('/atual', (req, res) => {
  res.json(loadEvents.getCurrentEvent);
});

module.exports = router;
