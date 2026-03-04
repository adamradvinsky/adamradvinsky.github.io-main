package com.adam.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@RestController
@CrossOrigin(origins="*")
public class EmailController{

    @Autowired  
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public String send(@RequestBody String emailText) { 
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);

            helper.setTo("nootnootadam@gmail.com");
            helper.setSubject("testingisengoase");
            helper.setText(emailText);

            mailSender.send(message);
            return "email sent";
            
        } catch(MessagingException e){
            e.printStackTrace();
            return "failed to send email";
        }
    }
}