# 🚀 Enhanced Portfolio Backend - File Upload System

## 🎯 NEW FEATURES ADDED

### 📄 CV Management
- **Upload CV**: Drag & drop or click to upload PDF files
- **Version Control**: Automatically archives previous CV versions
- **Download**: Direct download links for current and archived CVs
- **View**: Preview CVs directly in browser
- **Description**: Add descriptions to track CV versions

### 🏆 Certificate Management
- **Upload Certificates**: Support for PDF and image files (JPG, PNG)
- **Metadata**: Track certificate title, issuer, date issued, and description
- **Organization**: View all certificates in organized list
- **Download & View**: Direct access to certificate files

### 📊 Enhanced Admin Dashboard
- **Tabbed Interface**: Organized sections for Projects, CV, and Certificates
- **Drag & Drop**: Modern file upload with visual feedback
- **Progress Bars**: Upload progress indication
- **File Validation**: Automatic file type checking
- **Mobile Responsive**: Works perfectly on all devices

## 🔧 Technical Implementation

### File Storage Structure
```
public/
├── media/
│   ├── cv/                 # CV files
│   │   └── [timestamp]_filename.pdf
│   └── certificates/       # Certificate files
│       └── [timestamp]_filename.ext
└── data/
    └── documents.json      # File metadata tracking
```

### API Endpoints Added

#### CV Management
- `POST /api/admin/upload/cv` - Upload new CV
- `GET /api/admin/documents` - Get all document info
- `DELETE /api/admin/cv/:version` - Delete CV version
- `GET /api/cv/download` - Public CV download

#### Certificate Management
- `POST /api/admin/upload/certificate` - Upload certificate
- `DELETE /api/admin/certificates/:id` - Delete certificate
- `PUT /api/admin/certificates/:id` - Update certificate metadata

#### File Serving
- `GET /media/cv/:filename` - Serve CV files
- `GET /media/certificates/:filename` - Serve certificate files

### Security Features
- **File Type Validation**: Only allows specific file types
- **Size Limits**: 10MB maximum file size
- **Authentication**: All admin endpoints require JWT token
- **Path Sanitization**: Prevents directory traversal attacks
- **Filename Sanitization**: Removes dangerous characters

## 🚀 Usage Instructions

### Starting the Enhanced Backend
```bash
# Use the enhanced startup script
start-backend-enhanced.bat

# Or manually run the enhanced server
cd backend
node server-enhanced-files.js
```

### Admin Panel Access
1. Visit: `http://localhost:[PORT]/admin`
2. Login with password: `selma2024`
3. Navigate to CV or Certificates tabs
4. Drag & drop files or click to select
5. Fill in metadata and upload

### CV Management Workflow
1. **Upload New CV**: 
   - Go to CV Management tab
   - Drag your PDF file or click to select
   - Add optional description
   - Click "Upload CV"
   - Previous CV automatically archived

2. **View/Download CV**:
   - Current CV shown with view/download links
   - Previous versions listed separately
   - Public download available at `/api/cv/download`

### Certificate Management Workflow
1. **Upload Certificate**:
   - Go to Certificates tab
   - Drag PDF/image file or click to select
   - Fill in title, issuer, date, description
   - Click "Upload Certificate"

2. **Manage Certificates**:
   - View all certificates in organized list
   - Download or view any certificate
   - Delete certificates as needed
   - Update metadata if required

## 📱 Frontend Integration Ready

The backend is designed to work seamlessly with your existing frontend. You can add these features to your portfolio:

### CV Download Button
```javascript
// Add to your portfolio's contact or about section
<a href="/api/cv/download" 
   download="Selma_Bettaieb_CV.pdf" 
   className="cv-download-btn">
   📄 Download CV
</a>
```

### Certificates Display
```javascript
// Fetch and display certificates
const fetchCertificates = async () => {
  const response = await fetch('/api/documents');
  const data = await response.json();
  return data.certificates;
};
```

## 🔒 Security Considerations

- All admin endpoints require authentication
- File uploads are validated for type and size
- Files are stored outside web root when possible
- JWT tokens expire after 24 hours
- CORS properly configured for your domains

## 🌟 Next Steps

1. **Test the enhanced backend** with the new startup script
2. **Upload your CV and certificates** through the admin panel
3. **Integrate download links** into your frontend portfolio
4. **Consider adding more file types** if needed (presentations, etc.)
5. **Deploy enhanced backend** to your hosting platform

## 🎯 Benefits

- ✅ **Easy Content Management**: Update CV and certificates without code changes
- ✅ **Version Control**: Keep track of document history
- ✅ **Professional Presentation**: Organized file management
- ✅ **SEO Friendly**: Direct download links for better indexing
- ✅ **Mobile Optimized**: Works perfectly on all devices
- ✅ **Future Proof**: Easy to extend with more file types

Your portfolio backend is now a powerful content management system! 🚀
