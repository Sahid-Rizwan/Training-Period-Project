const mongoose =require('mongoose');
const myEventsModel = require('../Model/events');

const eventController = {
  async getOtherCollegeEvents(req, res) {
    try {
      const currentUserId = req.query.userId;
      
      console.log("current id: ",currentUserId);

      const events = await myEventsModel.find({
        userId: { $ne: currentUserId },
        eventType: "inter" // Only other colleges' events
      }).populate("userId", "collegeName location logofile");

      res.status(200).json({
        success: true,
        data: events,
        status: 200
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Server error",
        status: 500
      });
    }
  },

  async getSingleEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await myEventsModel.findOne({ _id: eventId });

      if (!event) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
          status: 404
        });
      }
      
      res.status(200).json({
        success: true,
        data: event,
        error: null,
        status: 200
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        data: null,
        error: err.message,
        status: 500
      });
    }
  },

  async getAllEvents(req, res) {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in headers"
      });
    }

    const events = await myEventsModel.find({userId}).populate({
      path: "userId",
      select: "collegeName location logofile"
    });
    

    res.status(200).json({
      success: true,
      data: events,
      error: null,
      status: 200
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
      status: 500
    });
  }
},

  async createEvent(req, res) {
    try {
      const userId = req.headers.userid;
      

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in headers" });
      }
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const { eventName, eventType, eventDate, eventDescription } = req.body;
      const file = req.file ? req.file.filename : null;

      const newEvent = new myEventsModel({
        id: new Date().getTime(),
        userId: userObjectId,
        eventName,
        eventType,
        eventDate,
        eventDescription,
        file
      });

      await newEvent.save();

      res.status(200).json({
        success: true,
        data: newEvent,
        message: "Event created successfully",
        status: 200
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        data: null,
        error: err.message,
        status: 500
      });
    }
  },

  async deleteEvent(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
        status: 200
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }
  },

  async updateEvent(req, res) {
    try {
      const eventId = req.params.id;
      const { eventName, eventType, eventDate, eventDescription } = req.body;

      if (!eventName || !eventType || !eventDate || !eventDescription) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      const updatedData = {
        eventName,
        eventType,
        eventDate,
        eventDescription,
      };
      if (req.file) {
        updatedData.file = req.file.filename;
      }

      const updated = await myEventsModel.findOneAndUpdate(
        { _id: eventId },
        updatedData,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "Event not found",
          status: 404
        });
      }

      // await updated.save();
      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        status: 200
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }
  }
};

module.exports = eventController;
