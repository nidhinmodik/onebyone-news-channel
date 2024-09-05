const mongoose = require('mongoose');
const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class authController {
    login = async (req, res) => {
        const { email, password } = req.body

        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }
        try {
            const user = await authModel.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    const obj = {
                        id: user.id,
                        name: user.name,
                        category: user.category,
                        role: user.role
                    }
                    const token = await jwt.sign(obj, process.env.secret, {
                        expiresIn: process.env.exp_time
                    })
                    return res.status(200).json({ message: 'login success', token })
                } else {
                    return res.status(404).json({ message: 'invalid password' })
                }
            } else {
                return res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.log(error);

        }

    }

    add_admin = async (req, res) => {
        const { email, name, password } = req.body;

        // Input validation
        if (!name) {
            return res.status(404).json({ message: 'Please provide a name' });
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide a password' });
        }
        if (!email) {
            return res.status(404).json({ message: 'Please provide an email' });
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'Please provide a valid email' });
        }

        try {
            // Check if admin already exists
            const admin = await authModel.findOne({ email: email.trim() });
            if (admin) {
                return res.status(404).json({ message: 'User already exists' });
            } else {
                // Create new admin
                const new_admin = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    role: 'admin'
                });
                return res.status(200).json({ message: 'Admin added successfully', admin: new_admin });
            }
        } catch (error) {
            return res.status(404).json({ message: 'Internal server error' });
        }
    }

    delete_admin = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Check if the ID is a valid MongoDB ObjectID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid admin ID' });
            }
    
            // Attempt to find and delete the admin by ID
            const admin = await authModel.findByIdAndDelete(id);
    
            // If the admin is not found, return a 404 error
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
    
            // Return success message if deletion was successful
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error deleting admin:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
    

    // Get all admins
    get_admins = async (req, res) => {
        try {
            const admins = await authModel.find({ role: 'admin' });
            res.status(200).json({ admins });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Get a specific admin by ID (optional)
    getAdminById = async (req, res) => {
        try {
            const admin = await authModel.findById(req.params.id);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json({ admin });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };


    delete_writer = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Check if the ID is a valid MongoDB ObjectID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid writer ID' });
            }
    
            // Attempt to find and delete the writer by ID
            const writer = await authModel.findByIdAndDelete(id);
    
            // If the writer is not found, return a 404 error
            if (!writer) {
                return res.status(404).json({ message: 'Writer not found' });
            }
    
            // Return success message if deletion was successful
            res.status(200).json({ message: 'Writer deleted successfully' });
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error deleting writer:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };




    add_writer = async (req, res) => {

        const { email, name, password, category } = req.body

        if (!name) {
            return res.status(404).json({ message: 'please provide name' })
        }
        if (!password) {
            return res.status(404).json({ message: 'please provide password' })
        }
        if (!category) {
            return res.status(404).json({ message: 'please provide category' })
        }
        if (!email) {
            return res.status(404).json({ message: 'please provide email' })
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'please provide valid email' })
        }
        try {
            const writer = await authModel.findOne({ email: email.trim() })
            if (writer) {
                return res.status(404).json({ message: 'User already exist' })
            } else {
                const new_writer = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    category: category.trim(),
                    role: 'writer'
                })
                return res.status(200).json({ message: 'writer add success', writer: new_writer })
            }
        } catch (error) {
            return res.status(404).json({ message: 'Internal server error' })
        }

    }


    get_writers = async (req, res) => {
        try {
            const writers = await authModel.find({ role: "writer" }).sort({ createdAt: -1 })
            return res.status(200).json({ writers })
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

     // Get Advertisers
     get_advertisers = async (req, res) => {
        try {
            const advertisers = await authModel.find({ role: "advertiser" }).sort({ createdAt: -1 });
            return res.status(200).json({ advertisers });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Add Advertiser
    add_advertiser = async (req, res) => {

        const { email, name, password, company } = req.body;

        if (!name) {
            return res.status(404).json({ message: 'Please provide name' });
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide password' });
        }
        if (!company) {
            return res.status(404).json({ message: 'Please provide company' });
        }
        if (!email) {
            return res.status(404).json({ message: 'Please provide email' });
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'Please provide a valid email' });
        }
        try {
            const advertiser = await authModel.findOne({ email: email.trim() });
            if (advertiser) {
                return res.status(404).json({ message: 'User already exists' });
            } else {
                const new_advertiser = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    company: company.trim(),
                    role: 'advertiser'
                });
                return res.status(200).json({ message: 'Advertiser added successfully', advertiser: new_advertiser });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    delete_advertiser = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Check if the ID is a valid MongoDB ObjectID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid Advertiser ID' });
            }
    
            // Attempt to find and delete the writer by ID
            const advertiser = await authModel.findByIdAndDelete(id);
    
            // If the writer is not found, return a 404 error
            if (!advertiser) {
                return res.status(404).json({ message: 'Writer not found' });
            }
    
            // Return success message if deletion was successful
            res.status(200).json({ message: 'Writer deleted successfully' });
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error deleting writer:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };


}


module.exports = new authController()
