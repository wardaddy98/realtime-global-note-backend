import _ from 'lodash';
import { Note } from '../../models/note.model.js';
import { handleResponse } from '../../utils/handleResponse.js';

export const getPaginatedNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    const totalElements = await Note.countDocuments();
    const totalPages = Math.ceil(totalElements / limit);

    let notes = await Note.find({})
      .skip(offset)
      .limit(limit)
      .populate({ path: 'contributedBy', select: '-__v -isOnline' })
      .populate({ path: 'createdBy', select: '-__v -isOnline' })
      .populate({ path: 'edits.editedBy', select: '-__v -isOnline' })
      .lean();

    //replace with aggregation
    notes = notes.map(e => {
      const tempNote = { ...e };
      tempNote.edits = tempNote?.edits
        ?.sort((a, b) => (a.editedAt > b.editedAt ? -1 : 1))
        .slice(0, 5);
      return tempNote;
    });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: page ? `Notes of page ${page} loaded successfully` : 'All notes loaded successfully',
      body: {
        notes,
        totalPages,
        currentPage: page,
      },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const createNote = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const payload = req.body;

    const createdNote = await Note.create({ ...payload, createdBy: userId });

    const note = await Note.findById(createdNote._id).populate({
      path: 'createdBy',
      select: '-__v -isOnline',
    });

    global.socketIo.emit('note-add', note);

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Note created successfully',
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { noteId } = req.params;

    const note = await Note.findById(noteId).lean();

    if (_.isEmpty(note)) {
      return handleResponse(res, {
        type: 'ERROR',
        message: 'Note does not exist',
      });
    }

    if (note.createdBy !== userId) {
      return handleResponse(res, {
        type: 'ERROR',
        message: 'You do not have permission to delete this note!',
      });
    }

    await Note.deleteOne({ _id: noteId });
    global.socketIo.emit('note-delete', noteId);

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Note deleted successfully',
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const editNote = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const payload = req.body;
    const { noteId } = req.params;

    const note = await Note.findById(noteId).lean();

    if (_.isEmpty(note)) {
      return handleResponse(res, {
        type: 'ERROR',
        message: 'Note does not exist',
      });
    }

    await Note.findOneAndUpdate(
      { _id: noteId },
      {
        $set: {
          content: payload.content,
          contributedBy: note.contributedBy?.includes(userId)
            ? note.contributedBy
            : [...note.contributedBy, userId],
          lastUpdated: Date.now(),
          edits: [
            ...note.edits,
            { content: payload.content, editedBy: userId, editedAt: Date.now() },
          ],
        },
      },
    );

    // remove this and use same aggregation as get notes without skip and limit
    const updatedNote = await Note.findById(note._id)
      .populate({ path: 'contributedBy', select: '-__v -isOnline' })
      .populate({ path: 'createdBy', select: '-__v -isOnline' })
      .populate({ path: 'edits.editedBy', select: '-__v -isOnline' })
      .lean();

    global.socketIo.emit('note-update', updatedNote);

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Note edited successfully',
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};
