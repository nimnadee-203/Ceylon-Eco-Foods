# Ceylon Eco Foods - Supplier System Testing Guide

## 🚀 Supplier Login & Dashboard Testing

### Prerequisites
1. Backend server running on port 5000
2. Frontend server running on port 3000
3. MongoDB connection established
4. Test supplier created: `kamal.perera@test.com` / `12345`

### Test Cases

#### 1. Supplier Login
- **URL**: `http://localhost:3000/supplier/login`
- **Test Credentials**: 
  - Email: `kamal.perera@test.com`
  - Password: `12345`
- **Expected**: Redirect to `/supplier/dashboard`

#### 2. Supplier Dashboard Features
- **URL**: `http://localhost:3000/supplier/dashboard`
- **Features to test**:
  - ✅ Welcome message with supplier name
  - ✅ Rating display with stars
  - ✅ Earnings dashboard with real data
  - ✅ Navigation to requests and submissions
  - ✅ Logout functionality

#### 3. Earnings Dashboard
- **Features to test**:
  - ✅ Total earnings display (LKR 15,000)
  - ✅ Pending payments display (LKR 5,000)
  - ✅ Submission statistics
  - ✅ Recent submissions list
  - ✅ Refresh button functionality
  - ✅ Progress bar visualization

#### 4. Request Management
- **URL**: `http://localhost:3000/supplier/requests`
- **Features to test**:
  - ✅ View all available requests
  - ✅ Request details (title, description, items, due date)
  - ✅ Status indicators
  - ✅ Submit supply button
  - ✅ Refresh functionality

#### 5. Submission System
- **URL**: `http://localhost:3000/supplier/requests/{id}/submit`
- **Features to test**:
  - ✅ View request details
  - ✅ Enter quantities for each item
  - ✅ Add notes
  - ✅ Set requested amount
  - ✅ Submit supply offer
  - ✅ Form validation

#### 6. My Submissions
- **URL**: `http://localhost:3000/supplier/submissions`
- **Features to test**:
  - ✅ View all submitted offers
  - ✅ Filter by status (all, pending, accepted, rejected)
  - ✅ Sort by date, amount, status
  - ✅ Submission details and status
  - ✅ Payment information

## 🔧 System Integration Tests

### Test Scenario 1: Complete Supplier Workflow
1. **Login as Supplier**
   - Use: `kamal.perera@test.com` / `12345`
   - Verify: Dashboard loads with correct data

2. **View Available Requests**
   - Navigate to "Available Requests"
   - Verify: Requests are displayed correctly

3. **Submit Supply Offer**
   - Click "Submit Supply" on a request
   - Fill in quantities and amount
   - Submit the offer
   - Verify: Success message and redirect

4. **Check Submission Status**
   - Navigate to "My Submissions"
   - Verify: New submission appears with "pending" status

### Test Scenario 2: Admin-Supplier Interaction
1. **Admin Reviews Submission**
   - Login as admin: `dularadilmika@gmail.com` / `12345`
   - Go to "View Submissions"
   - Find the supplier's submission

2. **Admin Makes Payment**
   - Accept submission with partial payment
   - Verify: Payment is recorded

3. **Supplier Checks Updates**
   - Login as supplier again
   - Check earnings dashboard
   - Verify: Earnings and pending payments updated

## 🐛 Common Issues & Solutions

### Issue 1: "Authentication required" error
**Solution**: 
- Check if supplier is logged in
- Verify localStorage has supplier data
- Clear browser cache and re-login

### Issue 2: "Failed to load requests" error
**Solution**:
- Check backend server status
- Verify MongoDB connection
- Check network connectivity

### Issue 3: Submission not appearing
**Solution**:
- Check if submission was successful
- Verify supplier ID in submission
- Check backend logs for errors

### Issue 4: Earnings not updating
**Solution**:
- Refresh the earnings dashboard
- Check if admin processed the payment
- Verify backend payment processing

## 📊 Performance Metrics

### Expected Response Times
- Login: < 2 seconds
- Dashboard load: < 3 seconds
- Requests list: < 2 seconds
- Submission processing: < 1 second

### Data Accuracy
- ✅ Earnings calculations correct
- ✅ Pending payments accurate
- ✅ Submission status updates
- ✅ Rating system functional

## 🔒 Security Features

### Authentication
- ✅ Supplier login validation
- ✅ JWT token management
- ✅ Secure logout

### Data Protection
- ✅ Input validation
- ✅ Authorization headers
- ✅ Error handling

## 📱 Mobile Responsiveness

### Test on Different Screen Sizes
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🎯 Quality Assurance Checklist

### Functionality
- [ ] Supplier login works
- [ ] Dashboard displays correctly
- [ ] Earnings data accurate
- [ ] Request viewing functional
- [ ] Submission system works
- [ ] Payment tracking accurate

### User Experience
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Loading states visible
- [ ] Responsive design
- [ ] Fast performance

### Data Integrity
- [ ] Accurate calculations
- [ ] Real-time updates
- [ ] Proper validation
- [ ] Error recovery

## 🚨 Critical Test Scenarios

### Scenario 1: New Supplier Registration
1. Go to supplier signup
2. Fill in all required fields
3. Submit registration
4. Login with new credentials
5. Verify dashboard loads

### Scenario 2: Multiple Submissions
1. Submit multiple supply offers
2. Check submission list
3. Verify all submissions appear
4. Test filtering and sorting

### Scenario 3: Payment Processing
1. Admin accepts submission
2. Admin makes partial payment
3. Supplier checks earnings
4. Verify amounts updated correctly

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
Supplier: kamal.perera@test.com

✅ Passed Tests:
- [ ] Supplier Login
- [ ] Dashboard Load
- [ ] Earnings Display
- [ ] Request Viewing
- [ ] Submission Creation
- [ ] Payment Tracking

❌ Failed Tests:
- [ ] Test Name: Issue Description

🔧 Issues Found:
1. Issue 1: Description
2. Issue 2: Description

📊 Performance:
- Login Time: ___ seconds
- Dashboard Load: ___ seconds
- Submission Processing: ___ seconds

Overall Status: ✅ PASS / ❌ FAIL
```

## 🎉 Success Criteria

The supplier system is considered fully functional when:
- ✅ Supplier can login successfully
- ✅ Dashboard displays accurate data
- ✅ Earnings and payments track correctly
- ✅ Request viewing works properly
- ✅ Submission system functions
- ✅ No critical errors in console
- ✅ All user flows complete successfully

## 🔗 Integration Points

### With Admin System
- ✅ Admin can view supplier submissions
- ✅ Admin can process payments
- ✅ Supplier earnings update in real-time

### With Backend APIs
- ✅ All API endpoints respond correctly
- ✅ Data validation works
- ✅ Error handling is proper

---

**Last Updated**: January 10, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
