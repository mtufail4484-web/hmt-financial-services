import { Resend } from 'resend';

// Lazy client: constructing Resend at module scope crashes build-time page
// data collection when RESEND_API_KEY is not set (e.g. CI/preview builds).
// Behavior in production (with the env var) is unchanged.
let resendClient = null;
function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function POST(request) {
  try {
    const {
      name,
      email,
      phone,
      business,
      country,
      service,
      requirements
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !business ||
      !country ||
      !service ||
      !requirements
    ) {
      return new Response(
        JSON.stringify({
          error: 'All fields are required'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // =========================
    // SEND EMAIL TO ADMIN
    // =========================

    const adminEmail = await getResend().emails.send({
      from: 'HMT Financial Services <info@hmtfinancialservices.com>',
      to: 'm.tufail4484@gmail.com',
      subject: `New Consultancy Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #071739; margin-bottom: 20px;">
            New Consultancy Request
          </h2>

          <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #fbbf24;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Business Type:</strong> ${business}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Service Required:</strong> ${service}</p>

            <p><strong>Requirements:</strong></p>

            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${requirements}
            </p>
          </div>

          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
            Please review this request and contact the client as soon as possible.
          </p>
        </div>
      `,
    });

    console.log('Admin email result:', adminEmail);

    if (!adminEmail || !adminEmail.data?.id) {
      return new Response(
        JSON.stringify({
          error: 'Failed to send admin email'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // =========================
    // SEND EMAIL TO CUSTOMER
    // =========================

    const clientEmail = await getResend().emails.send({
      from: 'HMT Financial Services <info@hmtfinancialservices.com>',
      to: email,
      subject: 'We Received Your Consultancy Request - HMT Financial Services',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 8px;">

          <h2 style="color: #071739; margin-bottom: 20px;">
            Thank You, ${name}!
          </h2>

          <p style="color: #374151; line-height: 1.6;">
            We have received your consultancy request and will get back to you shortly with a customized plan for your business.
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #fbbf24; margin: 20px 0;">

            <h3 style="color: #071739; margin-top: 0;">
              Request Details:
            </h3>

            <p><strong>Service Required:</strong> ${service}</p>
            <p><strong>Business Type:</strong> ${business}</p>
            <p><strong>Country:</strong> ${country}</p>

          </div>

          <p style="color: #374151; line-height: 1.6;">
            Our expert team at HMT Financial Services will analyze your requirements and provide you with professional financial solutions tailored to your needs.
          </p>

          <p style="color: #374151; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reach out to us.
          </p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Best regards,<br>
            HMT Financial Services Team<br>
            info@hmtfinancialservices.com
          </p>

        </div>
      `,
    });

    console.log('Client email result:', clientEmail);

    if (!clientEmail || !clientEmail.data?.id) {
      return new Response(
        JSON.stringify({
          error: 'Failed to send confirmation email'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {

    console.error('Email error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}