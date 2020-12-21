const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRIDAPIKEY)

// welcome email
const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'nikku.a1998@gmail.com',
        subject: 'Thanks for joining' ,
        text: `Welcome ${name}, to this new task manager application `
    
    }).then((res) => console.log(res))
    .catch((err) => console.log(err))
}

const sendFarewellEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'nikku.a1998@gmail.com',
        subject: 'Sorry to see you go' ,
        text: `Goodbye ${name}, hope you had a nice team with us. Please share with us your suggestions for improvement for better user experience`
    
    }).then((res) => console.log(res))
    .catch((err) => console.log(err))
    
}

module.exports = {sendWelcomeEmail, sendFarewellEmail}