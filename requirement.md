CV Builder

Overview

We want to develop a web based application for building CV. Through this application, users can 

add, update or delete his/her CVs. Users can create CV using existing layouts. Users need to 

register first to access the web application.

Functional Requirements:

1. Registration

When anyone opens the sign‑up link, they will see the form with the following fields.

1. Username (Mandatory)

2. Email (Mandatory)

3. Contact Number (Optional)

4. Password (Mandatory)

OR Register via Google or Facebook account

2. Login
Users can log in via username/email and password OR with Google and Facebook login. After 

successful login, users will be redirected to the Dashboard page.

3. Dashboard
In this page, users will see the CVs prepared by him earlier and would be able to preview, edit, 

download a CV in the form of PDF or share it over social media. If the user clicks on edit CV, he 

will be redirected to the editor page. Dashboard will also have an add button for the user to 

create a new CV. Every download / share will require a payment to be made.

4. Layouts
In Layouts, users will be able to preview the 2 ‑ 3 basic predefined layouts and choose one to 

start making their CV.

5. Editor
This page will be divided into two vertical sections, one with form fields asking the user for the 

info to be filled in the CV, and another for previewing the CV with the information entered 

according to the layout. Layout can be customized in the form of fonts, sizes and colors.

The form can be stepped in following manner ‑

1. Basic Details ‑ primary info of user such as image, name, email, phone, address, city, 

state, pincode and introductory paragraph.

2. Education ‑ educational qualifications like degree name, institution, percentage, etc.
3. Experience ‑ experience details like organization name, joining location, position, CTC, 

joining date, leaving date and technologies worked on.

4. Projects ‑ created project info such as project title, team size, duration, technologies, 

description, etc.

5. Skills ‑ technological and interpersonal skills accepting skill name and perfection in terms 

of percentage.

6. Social Profiles ‑ platform name and profile links for LinkedIn, Twitter, Skype, etc.

One input would be shown by default, multiple can be added / edited / deleted for all 

steps except basic details.

As the information is filled in by the user, preview should be updated in the layout 

simultaneously. Users can save the CV prepared, download it in the form of PDF, and share it 

over social media or mail as an attachment. If the user tries to leave / close the page, he should 

be prompted with an alert to save his information. Each download / share will require a 

payment to be made.

Non ‑ Functional Requirements:

1. Clean coding structure is expected.

2. Reusable components and responsive design are appreciated.

3. Use of lazy loading, memory efficient code is a must.

4. JWT / OAuth is expected for the login / registration process. Captcha is appreciated.

5. All form fields should contain necessary validations.

6. Functional components with hooks and ES6 standards should be used.

7. Use env variables, adding constants wherever necessary.

8. Proper request / response pattern to be followed.

9. Some generic unit test cases should be written for the application.

10. Making use of infinite scroll to load data efficiently in all pages.

Guidelines:

Time against each module indicates the maximum time limit. There will be no extension given.

Technology:

ReactJS , HTML, CSS, Bootstrap / Material UI, Node, Express, Database of your choice



