const {google}=require('googleapis');
const path = require('path');
const fs = require('fs');

const colors=require('colors');
const cred=require('../credentials/google/apikeys.json')
const send_mail=require('./composer.js');

module.exports={
async execute (interaction,client,spreadsheet_id)
{
    const spreadsheet=google.sheets({
        version:'v4',
        auth:`${cred.sheets}`
    });

    //get colums
   await spreadsheet.spreadsheets.values.get({
        spreadsheetId:`${spreadsheet_id}`,
        range: 'Sheet1',
        majorDimension:'COLUMNS'
    }).then(async(res) => {
;
        var mail_ids=res.data.values[0];
        var names= res.data.values[1];
        await interaction.reply(`***Found ${names.length} Entries***`);
       
        for (let i=0; i<names.length; i++)
        {            
            const files=fs.readdirSync('/home/raghav/Documents/code/whitehatian/others/mail_attachments').filter(f => f.endsWith('.pdf'))
            for (let a of files)
            {   
                var act_name=path.parse(a).name;
                act_name=act_name.toLowerCase().split(" ").join("");
                s_name=names[i].toLowerCase().split(" ").join("");
                if (act_name == s_name)

                {   console.log("Matched name".bgGreen,act_name,s_name);
                    console.log(`Mail id: ${mail_ids[i]}, Name: ${names[i].toLowerCase()} `)
                    att=`${a}`

                    const attachments = [
                        {
                            //filename:'testing.jpg',
                            path:`/home/raghav/Documents/code/whitehatian/others/mail_attachments/${att}`,
                        }
                    ];
            
                    const options = {
                        to: `${mail_ids[i]}`,
                        subject:`Cerificate of Recognition - Socio-Masters [White Hatians]`,
                        text:"Congragulations on securing in the Socio-Masters event organised by the Department of Cyber Security. Here is your certificate. We are looking forward to more participation in the coming days.\n\nEvent Winners: https://srmveccys.blogspot.com/2022/11/blog-post.html \n\n\nFind us on:\nWebsite: https://srmveccys.blogspot.com\nDiscord: https://discord.gg/w77zzjVkEB\nInstagram: https://instagram.com/srmvec_cys_whitehatians\nFacebook: https://facebook.com/srmveccyswhitehatians\nYoutube: https://youtube.com/@srmvec_cys_whitehatians\n\n\nWith Regards,\nTeam Whitehatians,\nDepartment of Cyber Security,\nSrmvec",
                        attachments:attachments,
                        textEncoding: 'base64',
                        headers: [
                            { key: 'X-Application-Developer', value: 'https://instagram.com/_.shadowctrl._'},
                            { key: 'X-Application-Version', value:'v1.0'},
                        ]
                    };
                    const msg_id = await send_mail(options,interaction);
            
                }
            }
        }
});
      
}
}
//.then((msgid) => console.log("All mails sent"));