const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "🚀 Vérifiez votre adresse e-mail - Ecommerce3D",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Vérification de votre adresse e-mail</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<tr>
<td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:40px;text-align:center;">

<h1 style="color:white;margin:0;font-size:32px;">
🖨️ Ecommerce3D
</h1>

<p style="color:#dbeafe;font-size:16px;margin-top:12px;">
Création • Impression 3D • Services Web
</p>

</td>
</tr>

<tr>
<td style="padding:45px;">

<h2 style="margin-top:0;color:#111827;font-size:28px;">
Bienvenue 👋
</h2>

<p style="color:#4b5563;font-size:16px;line-height:28px;">
Merci de vous être inscrit sur <strong>Ecommerce3D</strong>.
</p>

<p style="color:#4b5563;font-size:16px;line-height:28px;">
Avant de commencer, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous.
</p>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:35px 0;">

<a href="${verificationUrl}"
style="
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:18px 34px;
border-radius:10px;
display:inline-block;
font-size:16px;
font-weight:bold;
">
✅ Vérifier mon adresse
</a>

</td>
</tr>
</table>

<p style="color:#6b7280;font-size:15px;line-height:26px;">
Si le bouton ne fonctionne pas, copiez simplement ce lien dans votre navigateur :
</p>

<p style="word-break:break-all;">
<a href="${verificationUrl}" style="color:#2563eb;">
${verificationUrl}
</a>
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="font-size:14px;color:#6b7280;line-height:24px;">
⏳ Ce lien est valable pendant <strong>24 heures</strong>.
</p>

<p style="font-size:14px;color:#6b7280;line-height:24px;">
Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet e-mail.
</p>

</td>
</tr>

<tr>
<td style="background:#111827;padding:30px;text-align:center;">

<p style="color:#ffffff;font-size:16px;margin:0;">
<strong>Ecommerce3D</strong>
</p>

<p style="color:#9ca3af;font-size:14px;margin-top:10px;">
Impression 3D • Boutique en ligne • Services numériques
</p>

<p style="color:#6b7280;font-size:12px;margin-top:20px;">
© ${new Date().getFullYear()} Ecommerce3D - Tous droits réservés.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  });
}

module.exports = {
  sendVerificationEmail,
};
