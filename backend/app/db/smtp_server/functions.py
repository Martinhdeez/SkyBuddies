import smtplib
from email.message import EmailMessage
from db.smtp_server.config import configure_smtp  

async def send_reset_email(email: str, token: str):
    smtp_config = configure_smtp() 
    
    msg = EmailMessage()
    msg["Subject"] = "🔒 Restablecimiento de contraseña - SkyBuddies"
    msg["From"] = smtp_config["email"]
    msg["To"] = email
    
    reset_link = f"http://localhost:8000/reset-password?token={token}"
    
    msg.set_content(
        f"Para restablecer tu contraseña, haz clic en el siguiente enlace:\n\n{reset_link}\n\n"
        "Si no solicitaste este cambio, revisa la seguridad de tu cuenta.",
        subtype="plain"
    )
    
    msg.add_alternative(f"""
    <htmlcontraseñacontraseña>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center;">🔒 Restablecimiento de Contraseña</h2>
                <p style="color: #555; font-size: 16px;">
                    Hola, <br><br>
                    Hemos recibido una solicitud para restablecer tu contraseña. Para continuar, haz clic en el siguiente botón:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="{reset_link}" 
                       style="display: inline-block; background-color: #007BFF; color: white; text-decoration: none; 
                              padding: 12px 20px; border-radius: 5px; font-size: 16px;">
                        Restablecer contraseña
                    </a>
                </div>
                <p style="color: #555; font-size: 14px; text-align: center;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu seguridad es importante para nosotros.  
                </p>
                <p style="color: #888; font-size: 12px; text-align: center;">
                    © 2025 SkyBuddies. Todos los derechos reservados.
                </p>
            </div>
        </body>
    </html>
    """, subtype="html")

    try:
        with smtplib.SMTP(smtp_config["server"], smtp_config["port"]) as server:
            server.starttls()
            server.login(smtp_config["email"], smtp_config["password"])
            server.send_message(msg)
            print("Correo enviado correctamente")
    except Exception as e:
        print(f"Error enviando correo: {e}")
