const ImageKit = require('imagekit-javascript');
const Media = require('../models/media.model');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const base64 = buffer.toString('base64');

    const uploadResult = await imagekit.upload({
      file: base64,
      fileName: req.file.originalname,
    });

    const media = await Media.create({
      url: uploadResult.url,
      type: (req.body.type === 'video' ? 'video' : 'image'),
      linkedType: req.body.linkedType || undefined,
      linkedId: req.body.linkedId || undefined,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) : [],
    });

    res.status(201).json({ media, url: uploadResult.url });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Media upload failed:', error);
    res.status(500).json({ message: 'Media upload failed', error: error.message });
  }
}

async function listMedia(req, res) {
  try {
    const items = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list media', error: error.message });
  }
}

module.exports = {
  uploadMedia,
  listMedia,
};
