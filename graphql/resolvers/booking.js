const Booking = require("../../models/booking");
const { dateToString } = require("../../helpers/date");
const { user, singleEvent, transformEvent } = require("./populate");
const Event = require("../../models/event");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      // console.log(req.userId)
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        console.log(booking);
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.updatedAt),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking.user),
      event: singleEvent.bind(this, booking.event),
      createdAt: dateToString(result._doc.createdAt),
      updatedAt: dateToString(result._doc.updatedAt),
    };
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      await Booking.deleteOne({ _id: args.bookingId });
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking._doc.creator),
      };
      return event;
    } catch (err) {
      throw err;
    }
  },
};
