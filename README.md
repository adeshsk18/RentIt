# RentIt  <!--[Live Link](https://rentit-jei9.onrender.com/) | [Demo Video](https://youtu.be/SlHoExFpXx8) -->

MERN stack house rental app with realtime chat & request updates using socket.io and being hosted on [Render](https://render.com/). 

> [**Click here to visit the live site**](https://rentit-jei9.onrender.com/)


> [**Click here to watch the demo video**](https://youtu.be/SlHoExFpXx8)

## Screenshots
<style>
.screenshot {
    height: 45vh;
    margin-right: 10px;
    cursor: pointer;
}
</style>

<div style="overflow-x: auto; white-space: nowrap; padding: 20px 0;">
    <img class="screenshot" src="ss/profile.png" alt="Profile" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/home.png" alt="Home" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/search.png" alt="Search" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/listing.png" alt="Listing" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/register.png" alt="Register" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/request.png" alt="Request" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/profile_edit.png" alt="Profile Edit" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/add_property.png" alt="Add Property" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/edit_property.png" alt="Edit Property" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/user_profile.png" alt="User Profile" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/admin_or.png" alt="Admin OR" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/admin_pr.png" alt="Admin PR" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/properties.png" alt="Properties" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/owner_requests.png" alt="Owner Requests" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/user_requests.png" alt="User Requests" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/user_chat.png" alt="User Chat" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/owner_chat.png" alt="Owner Chat" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/ag_dial.png" alt="Agent Dialog" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/user_pay.png" alt="User Pay" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/contract.png" alt="Contract" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/ownerchat_final.png" alt="Owner Chat Final" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/brokeboi_tl.png" alt="Brokeboi TL" onclick="window.open(this.src)">
    <img class="screenshot" src="ss/listing_withstatus.png" alt="Listing with Status" onclick="window.open(this.src)">
</div>

## Installation

```sh
git clone https://github.com/nonkloq/rentit.git
cd rentit
```

rename `.env.example` to `.env` and fill in the variables in both frontend and backend folders.

### To Build And Run the app

@project root directory `~/rentit`
```sh
npm run build # will install all npm packages and build the project
npm run start
```

### To run server and client separately

to start the server
```sh
cd backend
npm install
npm run dev
```

to start the client
```sh
cd frontend
npm install
npm run start
```

The property listings are sampled from the [Houses Dataset](https://github.com/emanhamed/Houses-dataset) and property details filled using Gemini-1.5-Flash via the [Gemini API](https://ai.google.dev/). see [datafiller.ipynb](datafiller.ipynb) for code and data-filling process.
