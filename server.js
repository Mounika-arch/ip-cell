const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Add multer for file uploads
const path = require('path'); // Import path module
const fs = require('fs'); // Import fs for filesystem operations

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection

const mongoUri = 'mongodb+srv://ipcell:ipcell@cluster0.znwexop.mongodb.net/test?retryWrites=true&w=majority';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });



app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Serve the front HTML page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'front.html')); // Ensure 'front.html' exists in your project
// });
// Serve the front.html page
app.get('/front.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'front.html'));
});
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/about-ipr.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about-ipr.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/copyrights.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'copyrights.html'));
});
app.get('/designs.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'designs.html'));
});
app.get('/gallery.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'gallery.html'));
});
app.get('/ip-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ip-dashboard.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/patent-search.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'patent-search.html'));
});
app.get('/patent-search2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'patent-search2.html'));
})
app.get('/nippam.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nippam.html'));
})
app.get('/patents-college.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'patents-college.html'));
})
app.get('/idf.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'idf.html')); // Adjust the path as necessary
});

app.get('/success-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});
app.get('/success1-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success1.html'));
});
app.get('/retrieve-data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'retrivel.html')); // Adjust the path as necessary
});
app.get('/kapila.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'kapila.html')); // Adjust the path as necessary
  });

// A hardcoded username and password (for demonstration purposes)
const validUsername = 'admin';
const validPassword = 'password';

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Import the copyrights route
// const copyrightsRoute = require('./copyrightsroute');

// Use the copyrights route
// app.use(copyrightsRoute);
// Define Filed Schema
const filedSchema = new mongoose.Schema({
    applicationNumber: { type: String, required: true, unique: true }, // Primary Key
    applicantName: { type: String, required: true },
    titleOfInvention: { type: String, required: true },
    dateOfFiling: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Define Published Schema (foreign key reference to Filed)
const publishedSchema = new mongoose.Schema({
    applicationNumber: { type: String, required: true, ref: 'Filed' }, // Foreign Key
    applicantName: { type: String, required: true },
    titleOfInvention: { type: String, required: true },
    dateOfPublication: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Define Granted Schema (foreign key reference to Filed)
const grantedSchema = new mongoose.Schema({
    applicationNumber: { type: String, required: true, ref: 'Filed' }, // Foreign Key
    applicantName: { type: String, required: true },
    titleOfInvention: { type: String, required: true },
    grantNumber: { type: String, required: true },
    dateOfGrant: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Create Models
const FiledPatent = mongoose.model('Filed', filedSchema);
const PublishedPatent = mongoose.model('Published', publishedSchema);
const GrantedPatent = mongoose.model('Granted', grantedSchema);

// Fetch Patent Data based on Application Number (for Published or Granted forms)
app.get('/fetchPatentData', async (req, res) => {
    const { applicationNumber } = req.query;
    try {
        const patentData = await FiledPatent.findOne({ applicationNumber }).select('-academicYear');
        if (patentData) {
            res.status(200).json(patentData);
        } else {
            res.status(404).json({ message: 'No data found for the given Application Number.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data.' });
    }
});


// Save Filed Patent Data
app.post('/submitPatent', upload.single('uploadFile'), async (req, res) => {
    const { applicationNumber, applicantName, titleOfInvention, dateOfFiling, academicYear, department } = req.body;

    try {
        // Check if applicationNumber already exists
        const existingPatent = await FiledPatent.findOne({ applicationNumber });
        if (existingPatent) {
            return res.status(400).json({ message: 'Application Number already exists. It must be unique.' });
        }

        // Save new filed patent data
        const newPatent = new FiledPatent({
            applicationNumber,
            applicantName,
            titleOfInvention,
            dateOfFiling,
            academicYear,
            department,
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newPatent.save();
        res.status(201).json({ message: 'Filed Patent submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving filed patent data.' });
    }
});

app.post('/submitPublishedPatent', upload.single('uploadFile'), async (req, res) => {
  const { applicationNumber, dateOfPublication } = req.body;

  try {
      // Check if applicationNumber exists in Filed collection (foreign key check)
      const filedPatent = await FiledPatent.findOne({ applicationNumber });
      if (!filedPatent) {
          return res.status(404).json({ message: 'Application Number not found in Filed patents.' });
      }

      // Create the new published patent using all required fields
      const newPublishedPatent = new PublishedPatent({
          applicationNumber,
          applicantName: filedPatent.applicantName, // Corrected from 'filed' to 'filedPatent'
          titleOfInvention: filedPatent.titleOfInvention, // Corrected from 'filed' to 'filedPatent'
          dateOfPublication,
          academicYear:filedPatent.academicYear, // Corrected from 'filed' to 'filedPatent'
          department: filedPatent.department, // Corrected from 'filed' to 'filedPatent'
          fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
      });

      await newPublishedPatent.save();
      res.status(201).json({ message: 'Published Patent submitted successfully!' });
  } catch (error) {
      console.error('Error saving published patent data:', error); // Log the error for debugging
      res.status(500).json({ message: 'Error saving published patent data.' });
  }
});


// Save Granted Patent Data
app.post('/submitGrantedPatent', upload.single('uploadFile'), async (req, res) => {
    const { applicationNumber,grantNumber, dateOfGrant } = req.body;

    try {
        // Check if applicationNumber exists in Filed collection (foreign key check)
        const filedPatent = await FiledPatent.findOne({ applicationNumber });
        if (!filedPatent) {
            return res.status(404).json({ message: 'Application Number not found in Filed patents.' });
        }

        // Save granted patent data
        const newGrantedPatent = new GrantedPatent({
            applicationNumber,
            applicantName: filedPatent.applicantName, // Corrected from 'filed' to 'filedPatent'
            titleOfInvention: filedPatent.titleOfInvention, // Corrected from 'filed' to 'filedPatent'
            grantNumber,
            dateOfGrant,
            academicYear: filedPatent.academicYear, // Corrected from 'filed' to 'filedPatent'
           department: filedPatent.department, // Corrected from 'filed' to 'filedPatent'
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newGrantedPatent.save();
        res.status(201).json( {message: 'Granted Patent submitted successfully!'} );
    } catch (error) {
        res.status(500).json({ message: 'Error saving granted patent data.' });
    }
});


// Define Design Filed Schema
const designFiledSchema = new mongoose.Schema({
    designNumber: { type: String, required: true, unique: true }, // Primary Key
    applicantName: { type: String, required: true },
    titleOfInvention: { type: String, required: true },
    dateOfFile: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Define Design Registered Schema (foreign key reference to Filed)
const designRegisteredSchema = new mongoose.Schema({
    designNumber: { type: String, required: true, ref: 'DesignFiled' }, // Foreign Key
    applicantName: { type: String, required: true },
    titleOfInvention: { type: String, required: true },
    dateOfRegistration: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Create Models
const DesignFiled = mongoose.model('DesignFiled', designFiledSchema);
const DesignRegistered = mongoose.model('DesignRegistered', designRegisteredSchema);

// Fetch Design Patent Data based on Design Number (for Registered form)
app.get('/fetchDesignPatentData', async (req, res) => {
    const { designNumber } = req.query;

    try {
        const designData = await DesignFiled.findOne({ designNumber }).select('-academicYear');
        if (designData) {
            res.status(200).json(designData);
        } else {
            res.status(404).json({ message: 'No data found for the given Design Number.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

// Save Design Filed Patent Data
app.post('/submitDesignFiled', upload.single('uploadFile'), async (req, res) => {
    const { designNumber, applicantName, titleOfInvention, dateOfFile, academicYear, department } = req.body;
             // Validate design number format
const designNumberPattern = /^\d{6}-\d{3}$/;
if (!designNumberPattern.test(designNumber)) {
  return res.status(400).send('Please enter a valid design number with hyphens');
}  

    try {
        // Check if designNumber already exists
        const existingDesign = await DesignFiled.findOne({ designNumber });
        if (existingDesign) {
            return res.status(400).json({ message: 'Design Number already exists. It must be unique.' });
        }
 

        // Save new filed design patent data
        const newDesign = new DesignFiled({
            designNumber,
            applicantName,
            titleOfInvention,
            dateOfFile,
            academicYear,
            department,
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newDesign.save();
        res.status(201).json({ message: 'Design Filed Patent submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving design filed patent data.' });
    }
});

// Save Design Registered Patent Data
app.post('/submitDesignRegistered', upload.single('uploadFile'), async (req, res) => {
    const { designNumber,applicantName, titleOfInvention, dateOfRegistration,academicYear, department } = req.body;

    try {
        // Check if designNumber exists in Filed collection (foreign key check)
        const designPatent = await DesignFiled.findOne({ designNumber });
        if (!designPatent) {
            return res.status(404).json({ message: 'Design Number not found in Filed designs.' });
        }

        const designNumberPattern = /^\d{6}-\d{3}$/;
        if (!designNumberPattern.test(designNumber)) {
          return res.status(400).send('Please enter a valid design number with hyphens');
        }
        

        // Create the new registered design using all required fields
        const newRegisteredDesign = new DesignRegistered({
            designNumber,
            applicantName: designPatent.applicantName, // Corrected from 'filed' to 'filedPatent'
            titleOfInvention: designPatent.titleOfInvention, // Corrected from 'filed' to 'filedPatent'
            dateOfRegistration,
            academicYear: designPatent.academicYear, // Corrected from 'filed' to 'filedPatent'
           department: designPatent.department, // Corrected from 'filed' to 'filedPatent'
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newRegisteredDesign.save();
        res.status(201).json({ message: 'Design Registered Patent submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving design registered patent data.' });
    }
});

// Define Copyright Filed Schema
const copyrightFiledSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true }, // Primary Key
    authorName: { type: String, required: true },
    titleOfWork: { type: String, required: true },
    dateOfFiling: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Define Copyright Registered Schema (foreign key reference to Filed)
const copyrightRegisteredSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, ref: 'CopyrightFiled' }, // Foreign Key
    authorName: { type: String, required: true },
    titleOfWork: { type: String, required: true },
    dateOfCreation: { type: Date, required: true },
    academicYear: { type: String, required: true },
    department: [String],
    fileName: { type: String }
});

// Create Models
const CopyrightFiled = mongoose.model('CopyrightFiled', copyrightFiledSchema);
const CopyrightRegistered = mongoose.model('CopyrightRegistered', copyrightRegisteredSchema);

// Fetch Copyright Data based on Registration Number (for Registered form)
app.get('/fetchCopyrightData', async (req, res) => {
    const { registrationNumber } = req.query;
    try {
        const copyrightData = await CopyrightFiled.findOne({ registrationNumber }).select('-academicYear');
        if (copyrightData) {
            res.status(200).json(copyrightData);
        } else {
            res.status(404).json({ message: 'No data found for the given Registration Number.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

// Save Copyright Filed Data
app.post('/submitCopyright', upload.single('uploadFile'), async (req, res) => {
    const { registrationNumber,  authorName,titleOfWork, dateOfFiling, academicYear, department } = req.body;

    try {
        // Check if registrationNumber already exists
        const existingCopyright = await CopyrightFiled.findOne({ registrationNumber });
        if (existingCopyright) {
            return res.status(400).json({ message: 'Registration Number already exists. It must be unique.' });
        }

        // Save new filed copyright data
        const newCopyright = new CopyrightFiled({
            registrationNumber,
            authorName,
            titleOfWork,
            dateOfFiling,
            academicYear,
            department,
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newCopyright.save();
        res.status(201).json({ message: 'Copyright Filed submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving copyright filed data.' });
    }
});

// Save Copyright Registered Data
app.post('/submitRegisteredCopyright', upload.single('uploadFile'), async (req, res) => {
    const { registrationNumber,  authorName,titleOfWork,dateOfCreation,academicYear, department } = req.body;

    try {
        // Check if registrationNumber exists in Filed collection (foreign key check)
        const copyrightPatent = await CopyrightFiled.findOne({ registrationNumber });
        if (!copyrightPatent) {
            return res.status(404).json({ message: 'Registration Number not found in Filed copyrights.' });
        }

        // Create the new registered copyright using all required fields
        const newRegisteredCopyright = new CopyrightRegistered({
            registrationNumber,
            authorName: copyrightPatent.authorName, // Corrected from 'filed' to 'filedPatent'
            titleOfWork: copyrightPatent.titleOfWork, // Corrected from 'filed' to 'filedPatent'
            dateOfCreation,
            academicYear: copyrightPatent.academicYear, // Corrected from 'filed' to 'filedPatent'
           department: copyrightPatent.department, // Corrected from 'filed' to 'filedPatent'
            fileName: req.file ? req.file.originalname : null // Save the filename if a file is uploaded
        });

        await newRegisteredCopyright.save();
        res.status(201).json({ message: 'Copyright Registered submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving copyright registered data.' });
    }
});

// Route to handle form submission
app.post('/retrieve-data', async (req, res) => {
    const { type, status, academic_year, start_date, end_date, department, countOnly } = req.body;

    if (!type || !status || (!academic_year && (!start_date || !end_date)) || !department) {
        return res.send("All fields are required.");
    }

    // Prepare query based on user input
    let collection, headers, displayHeaders, dateField;
    let query = {};
    let departmentQuery = { $or: department.map(dept => ({ department: new RegExp(dept, 'i') })) };

    // Define the appropriate collection, headers, and date field based on type and status
    switch (type) {
        case 'patent':
            switch (status) {
                case 'filed':
                    collection = 'fileds';
                    headers = ['applicationNumber', 'applicantName', 'titleOfInvention', 'dateOfFiling', 'academicYear', 'department'];
                    displayHeaders = ['Application Number', 'Applicant Name', 'Title of Invention', 'Date of Filing', 'Academic Year', 'Department'];
                    dateField = 'dateOfFiling';
                    break;
                case 'published':
                    collection = 'publisheds';
                    headers = ['applicationNumber', 'applicantName', 'titleOfInvention', 'dateOfPublication', 'academicYear', 'department'];
                    displayHeaders = ['Application Number', 'Applicant Name', 'Title of Invention', 'Date of Publication', 'Academic Year', 'Department'];
                    dateField = 'dateOfPublication';
                    break;
                case 'granted':
                    collection = 'granteds';
                    headers = ['applicationNumber', 'applicantName', 'titleOfInvention', 'grantNumber', 'dateOfGrant', 'academicYear', 'department'];
                    displayHeaders = ['Application Number', 'Applicant Name', 'Title of Invention', 'Grant Number', 'Date of Grant', 'Academic Year', 'Department'];
                    dateField = 'dateOfGrant';
                    break;
            }
            break;
        case 'designpatent':
            if (status === 'filed') {
                collection = 'designfileds';
                headers = ['designNumber', 'applicantName', 'titleOfInvention', 'dateOfFile', 'academicYear', 'department'];
                displayHeaders = ['Design Number', 'Applicant Name', 'Title of Invention', 'Date of Filing', 'Academic Year', 'Department'];
                dateField = 'dateOfFile';
            } else if (status === 'registered') {
                collection = 'designregistereds';
                headers = ['designNumber', 'applicantName', 'titleOfInvention', 'dateOfRegistration', 'academicYear', 'department'];
                displayHeaders = ['Design Number', 'Applicant Name', 'Title of Invention', 'Date of Registration', 'Academic Year', 'Department'];
                dateField = 'dateOfRegistration';
            }
            break;
        case 'copyright':
            if (status === 'registered') {
                collection = 'copyrightregistereds';
                headers = ['registrationNumber', 'authorName', 'titleOfWork', 'dateOfCreation', 'academicYear', 'department'];
                displayHeaders = ['Registration Number', 'Author Name', 'Title of Work', 'Date of Creation', 'Academic Year', 'Department'];
                dateField = 'dateOfCreation';
            } else if (status === 'filed') {
                collection = 'copyrightfileds';
                headers = ['registrationNumber', 'authorName', 'titleOfWork', 'dateOfFiling', 'academicYear', 'department'];
                displayHeaders = ['Registration Number', 'Author Name', 'Title of Work', 'Date of Filing', 'Academic Year', 'Department'];
                dateField = 'dateOfFiling';
            }
            break;
        default:
            return res.send("Invalid type.");
    }

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Apply date or academic year filter
    if (academic_year) {
        query.academicYear = academic_year;
    } else if (start_date && end_date) {
        try {
            const startDateObj = new Date(start_date);
            const endDateObj = new Date(end_date);
            if (!isNaN(startDateObj) && !isNaN(endDateObj)) {
                query[dateField] = {
                    $gte: startDateObj,
                    $lte: endDateObj
                };
            } else {
                return res.send("Invalid start or end date.");
            }
        } catch (error) {
            return res.send("Error in date conversion: " + error.message);
        }
    }

    // Merge department query
    query = { ...query, ...departmentQuery };

    // Check if it's count-only mode
    if (countOnly === '1') {
        try {
            const count = await mongoose.connection.db.collection(collection).countDocuments(query);
            return res.send(`Total Records: ${count}`);
        } catch (error) {
            return res.send(`Error: ${error.message}`);
        }
    }

    // If not count-only, retrieve actual data
    try {
        const data = await mongoose.connection.db.collection(collection).find(query).toArray();
        if (data.length > 0) {
            let table = `<table border='1' cellpadding='5' cellspacing='0' style='width:100%; border-collapse:collapse;'><thead><tr>`;

            // Use display headers for table headers
            displayHeaders.forEach(header => {
                table += `<th>${header}</th>`;
            });
            table += `</tr></thead><tbody>`;

            // Create table rows with data
            data.forEach(row => {
                table += `<tr>`;
                headers.forEach((header, index) => {
                    let value = row[header] || 'N/A';

                    // Apply date formatting only to specific date fields
                    if ((header === 'dateOfFiling' || header === 'dateOfCreation' || header.includes('date')) && !isNaN(Date.parse(value))) {
                        value = formatDate(value);
                    }

                    table += `<td>${value}</td>`;
                });
                table += `</tr>`;
            });

            table += `</tbody></table>`;
            res.send(table);
        } else {
            res.send("No records found.");
        }
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});


// Route to fetch all registered copyrights
app.get('/fetchAllCopyrights', async (req, res) => {
    try {
        const data = await CopyrightRegistered.find({}); // Fetch all records from the 'copyrightregistereds' collection
        if (data.length > 0) {
            let table = `<table border='1' cellpadding='5' cellspacing='0' style='width:100%; border-collapse:collapse;'><thead><tr>`;
            
            // Define the display headers and corresponding database fields
            const headers = [
                { display: 'Serial No', field: null }, // For index
                { display: 'Registration Number', field: 'registrationNumber' },
                { display: 'Author Name', field: 'authorName' },
                { display: 'Title of Work', field: 'titleOfWork' },
                { display: 'Date of Creation', field: 'dateOfCreation' },
                { display: 'Academic Year', field: 'academicYear' }
            ];

            // Create table headers
            headers.forEach(header => {
                table += `<th>${header.display}</th>`;
            });
            table += `</tr></thead><tbody>`;

            // Create table rows with the fetched data
            data.forEach((row, index) => {
                table += `<tr>`;
                headers.forEach((header, i) => {
                    if (i === 0) {
                        // Serial No column
                        table += `<td>${index + 1}</td>`;
                    } else {
                        let value = row[header.field] || 'N/A'; // Get value from the corresponding field
                        // Format date fields if necessary
                        if ((header.field === 'dateOfCreation' || (header.field && header.field.includes('date'))) && !isNaN(Date.parse(value))) {
                            value = new Date(value).toLocaleDateString('en-GB'); // Convert date to dd/mm/yyyy format
                        }
                        table += `<td>${value}</td>`;
                    }
                });
                table += `</tr>`;
            });

            table += `</tbody></table>`;
            res.send(table); // Send the HTML table as the response
        } else {
            res.send("No registered copyrights found.");
        }
    } catch (error) {
        console.error(`Error fetching registered copyrights: ${error.message}`); // Log the error for debugging
        res.status(500).send(`Error fetching registered copyrights: ${error.message}`);
    }
});


// Route to fetch all registered designs
app.get('/fetchAllDesigns', async (req, res) => {
    try {
        const data = await DesignRegistered.find({});
        // console.log("Fetched Data:", data); // Log the fetched data
        if (data.length > 0) {
            let table = `<table border='1' cellpadding='5' cellspacing='0' style='width:100%; border-collapse:collapse;'><thead><tr>`;
            
            // Define the display headers and corresponding database fields
            const headers = [
                { display: 'Serial No', field: null }, // For index
                { display: 'Design Number', field: 'designNumber' },
                { display: 'Applicant Name', field: 'applicantName' },
                { display: 'Title of Invention', field: 'titleOfInvention' },
                { display: 'Date of Registration', field: 'dateOfRegistration' },
                { display: 'Academic Year', field: 'academicYear' }
            ];

            // Create table header row
            headers.forEach(header => {
                table += `<th>${header.display}</th>`;
            });
            table += `</tr></thead><tbody>`;

            // Create table body with data
            data.forEach((row, index) => {
                table += `<tr>`;
                headers.forEach((header, i) => {
                    if (i === 0) {
                        // Serial No column
                        table += `<td>${index + 1}</td>`;
                    } else {
                        let value = row[header.field] || 'N/A'; // Get the value from the row
                        if ((header.field === 'dateOfRegistration' || (header.field && header.field.includes('date'))) && !isNaN(Date.parse(value))) {
                            value = new Date(value).toLocaleDateString('en-GB'); // Format date to DD/MM/YYYY
                        }
                        table += `<td>${value}</td>`;
                    }
                });
                table += `</tr>`;
            });

            table += `</tbody></table>`;
            res.send(table);
        } else {
            res.send("No registered designs found.");
        }
    } catch (error) {
        console.error(`Error fetching registered designs: ${error.message}`);
        res.status(500).send(`Error fetching registered designs: ${error.message}`);
    }
});


// Route to fetch all granted patents
app.get('/fetchAllGrantedPatents', async (req, res) => {
    try {
        const data = await GrantedPatent.find({});
        // console.log("Fetched Granted Patents Data:", data); // Log the fetched data

        if (data.length > 0) {
            let table = `<table border='1' cellpadding='5' cellspacing='0' style='width:100%; border-collapse:collapse;'><thead><tr>`;
            
            // Define the headers and the corresponding database field names
            const headers = [
                { display: 'Serial No', field: null }, // For index
                { display: 'Application Number', field: 'applicationNumber' },
                { display: 'Applicant Name', field: 'applicantName' },
                { display: 'Title Of Invention', field: 'titleOfInvention' },
                { display: 'Grant Number', field: 'grantNumber' },
                { display: 'Date Of Grant', field: 'dateOfGrant' },
                { display: 'Academic Year', field: 'academicYear' }
            ];

            // Create table header row
            headers.forEach(header => {
                table += `<th>${header.display}</th>`;
            });
            table += `</tr></thead><tbody>`;

            // Create table body with data
            data.forEach((row, index) => {
                table += `<tr>`;
                headers.forEach((header, i) => {
                    if (i === 0) {
                        // For 'Serial No'
                        table += `<td>${index + 1}</td>`;
                    } else {
                        let value = row[header.field] || 'N/A'; // Access the field from the row data
                        if ((header.field && (header.field.includes('Date') || header.field.includes('date'))) && !isNaN(Date.parse(value))) {
                            value = new Date(value).toLocaleDateString('en-GB'); // Format dates to DD/MM/YYYY
                        }
                        table += `<td>${value}</td>`;
                    }
                });
                table += `</tr>`;
            });

            table += `</tbody></table>`;
            res.send(table);
        } else {
            res.send("No granted patents found.");
        }
    } catch (error) {
        console.error(`Error fetching granted patents: ${error.message}`);
        res.status(500).send(`Error fetching granted patents: ${error.message}`);
    }
});

app.post('/deletePatent', async (req, res) => {
    const { applicationNumberOrDesignNumber } = req.body;
    // console.log('Received Number:', applicationNumberOrDesignNumber);

    const designNumberPattern = /^\d{6}-\d{3}$/;
    const numericPattern = /^\d+$/;

    try {
        let message = '';
        if (designNumberPattern.test(applicationNumberOrDesignNumber)) {
            const designNumber = applicationNumberOrDesignNumber;
            const designFiledResult = await DesignFiled.findOneAndDelete({ designNumber });
            const designRegisteredResult = await DesignRegistered.findOneAndDelete({ designNumber });

            if (designFiledResult || designRegisteredResult) {
                message = `Design records with Design Number ${designNumber} deleted successfully!`;
            } else {
                message = `No design records found for Design Number ${designNumber}.`;
            }
        } else if (numericPattern.test(applicationNumberOrDesignNumber)) {
            const applicationOrRegistrationNumber = applicationNumberOrDesignNumber;

            const filedResult = await FiledPatent.findOneAndDelete({ applicationNumber: applicationOrRegistrationNumber });
            const publishedResult = await PublishedPatent.findOneAndDelete({ applicationNumber: applicationOrRegistrationNumber });
            const grantedResult = await GrantedPatent.findOneAndDelete({ applicationNumber: applicationOrRegistrationNumber });

            if (filedResult || publishedResult || grantedResult) {
                message = `Patent records with Application Number ${applicationOrRegistrationNumber} deleted successfully!`;
            } else {
                const copyrightFiledResult = await CopyrightFiled.findOneAndDelete({ registrationNumber: applicationOrRegistrationNumber });
                const copyrightRegisteredResult = await CopyrightRegistered.findOneAndDelete({ registrationNumber: applicationOrRegistrationNumber });

                if (copyrightFiledResult || copyrightRegisteredResult) {
                    message = `Copyright records with Registration Number ${applicationOrRegistrationNumber} deleted successfully!`;
                } else {
                    message = `No patent or copyright records found for Number ${applicationOrRegistrationNumber}.`;
                }
            }
        } else {
            return res.status(400).json({ message: 'Invalid number format.', success: false });
        }

        // Redirect to the success page with the message in query parameters
        return res.redirect(`/success1-page?message=${encodeURIComponent(message)}`);
    } catch (error) {
        console.error('Error deleting records:', error);
        return res.status(500).json({ message: 'Error deleting records.', success: false });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
