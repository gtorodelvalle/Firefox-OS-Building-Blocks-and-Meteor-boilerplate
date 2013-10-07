Meteor.startup(function() {
  process.env.MAIL_URL =
    'smtp://postmaster%40feedapp.mailgun.org:7o6af9i-4499@smtp.mailgun.org:587';
  Meteor.methods({
    sendEmail: function(options) {
      Email.send(options);
    }
  });
});
