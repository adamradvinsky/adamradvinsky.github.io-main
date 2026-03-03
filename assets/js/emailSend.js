// fetch("http://localhost:8080/send", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ message: "Test from browser" })
// })
// .then(res => res.text())
// .then(console.log)
// .catch(console.error);


// const options = {
//   method: "POST",
//   headers: {
//     'Content-Type' : 'application/json'
//   },
//   body: JSON.stringify("blahblah")
// };


//fetch("http://localhost:8080/send", )

async function sendEmail(){
  console.log(" TRYING TO SEND AN EMAIL")

  const messageText = " HEY IM SENDING AN EMAIL";

  const url = "http://localhost:8080/send";

  try {
    
    


  } catch (error) {
    console.log(error);
  }

}