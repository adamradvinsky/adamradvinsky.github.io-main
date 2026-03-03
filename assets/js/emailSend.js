async function sendEmail() {

  const url = "http://localhost:8080/send";

  try {


    console.log(" TRYING TO SEND AN EMAIL")
    const respons = fetch(url, {
      method: "POST",
      body: " bruh hello email text is diff i hope?" ,
    });

    console.log(" I have sent an email !?")

  } catch (error) {
    console.log(error);
  }

}