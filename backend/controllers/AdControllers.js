const { formidable } = require('formidable');
const cloudinary = require('cloudinary').v2;
const adModel = require('../models/adModel');
const { mongo: { ObjectId } } = require('mongoose');

class adController {

    // Add a new advertisement (image or video)
    add_ad = async (req, res) => {
        const { id } = req.userInfo;  // Assuming userInfo has the advertiser's ID
        const form = formidable({});

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });

        try {
            const [_, files] = await form.parse(req);
            const file = files.media[0]; // Assuming the field name for file upload is 'media'
            const isVideo = file.mimetype.startsWith('video/');

            let uploadOptions = { folder: 'ad_media' };
            if (isVideo) {
                uploadOptions.resource_type = 'video';
            }

            const { url, duration } = await cloudinary.uploader.upload(file.filepath, uploadOptions);

            const ad = await adModel.create({
                advertiserId: id,
                mediaUrl: url,
                mediaType: isVideo ? 'video' : 'image',
                duration: isVideo ? duration : undefined
            });

            return res.status(201).json({ message: 'Advertisement added successfully', ad });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Update an existing advertisement (image or video) by ID
    update_ad = async (req, res) => {
        const { ad_id } = req.params;
        const form = formidable({});

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });

        try {
            const [_, files] = await form.parse(req);
            let mediaUrl;
            let mediaType;
            let duration;

            if (Object.keys(files).length > 0) {
                const ad = await adModel.findById(ad_id);
                if (ad) {
                    const splitMedia = ad.mediaUrl.split('/');
                    const mediaFile = splitMedia[splitMedia.length - 1].split('.')[0];
                    await cloudinary.uploader.destroy(mediaFile, { resource_type: ad.mediaType === 'video' ? 'video' : 'image' });

                    const file = files.media[0]; // Assuming the field name for file upload is 'media'
                    const isVideo = file.mimetype.startsWith('video/');

                    let uploadOptions = { folder: 'ad_media' };
                    if (isVideo) {
                        uploadOptions.resource_type = 'video';
                    }

                    const data = await cloudinary.uploader.upload(file.filepath, uploadOptions);
                    mediaUrl = data.url;
                    mediaType = isVideo ? 'video' : 'image';
                    duration = isVideo ? data.duration : undefined;
                }
            }

            const updatedAd = await adModel.findByIdAndUpdate(ad_id, { mediaUrl, mediaType, duration }, { new: true });

            return res.status(200).json({ message: 'Advertisement updated successfully', updatedAd });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Delete an existing advertisement by ID
    delete_ad = async (req, res) => {
        const { ad_id } = req.params;

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });

        try {
            const ad = await adModel.findById(ad_id);
            if (!ad) {
                return res.status(404).json({ message: 'Advertisement not found' });
            }

            if (ad.mediaUrl) {
                const splitMedia = ad.mediaUrl.split('/');
                const mediaFile = splitMedia[splitMedia.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(mediaFile, { resource_type: ad.mediaType === 'video' ? 'video' : 'image' });
            } else {
                console.warn('No mediaUrl found for advertisement ID:', ad_id);
            }

            await adModel.findByIdAndDelete(ad_id);

            return res.status(200).json({ message: 'Advertisement deleted successfully' });
        } catch (error) {
            console.error('Error deleting advertisement:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };


    // Get all advertisements (dashboard)
    get_dashboard_ads = async (req, res) => {
        const { id, role } = req.userInfo;
        try {
            let ads;
            if (role === 'admin' || role === 'superadmin') {
                ads = await adModel.find({}).sort({ createdAt: -1 });
            } else {
                ads = await adModel.find({ advertiserId: new ObjectId(id) }).sort({ createdAt: -1 });
            }
            return res.status(200).json({ ads });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Get a single advertisement by ID (dashboard)
    get_dashboard_single_ad = async (req, res) => {
        const { ad_id } = req.params;
        try {
            const ad = await adModel.findById(ad_id);
            return res.status(200).json({ ad });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Get all advertisements for the public
    get_all_ads = async (req, res) => {
        try {
            const ads = await adModel.find({}).sort({ createdAt: -1 });
            return res.status(200).json({ ads });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Get a specific advertisement by ID
    get_ad = async (req, res) => {
        const { ad_id } = req.params;
        try {
            const ad = await adModel.findById(ad_id);
            if (ad) {
                return res.status(200).json({ ad });
            } else {
                return res.status(404).json({ message: 'Advertisement not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };


    
    
}

module.exports = new adController();