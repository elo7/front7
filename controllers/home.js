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
    getCurrentEvent: events[0]
  }
})();

router.get(['/', 'index.html'], (req, res) => {
	res.render('home', loadEvents.getCurrentEvent);
});

router.get('/palestrantes', (req, res) => {
  res.render('speakers', loadSpeakers.getSpeakers);
});

router.get('/palestrante/:link', (req, res) => {
  res.render('speaker', loadSpeakers.getSpeakerByName(req.params.link));
});

router.get('/eventos', (req, res) => {
  res.render('events', loadEvents.getEvents);
});

module.exports = router;
