const sendEmail = require("./sendEmail");

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );
}

function createItemsHtml(items = []) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;">
            ${escapeHtml(item.name)}
          </td>

          <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;text-align:center;">
            ${Number(item.quantity || 0)}
          </td>

          <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;text-align:right;">
            ₹${formatMoney(
              Number(item.price || 0) *
                Number(item.quantity || 0)
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

function emailLayout({
  title,
  message,
  content = "",
}) {
  return `
    <!DOCTYPE html>

    <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f5f5f5;
          font-family:Arial,sans-serif;
          color:#111111;
        "
      >
        <div
          style="
            max-width:620px;
            margin:0 auto;
            padding:30px 15px;
          "
        >
          <div
            style="
              background:#111111;
              color:#ffffff;
              text-align:center;
              padding:24px;
            "
          >
            <h1
              style="
                margin:0;
                font-size:26px;
                letter-spacing:3px;
              "
            >
              VELNORA
            </h1>
          </div>

          <div
            style="
              background:#ffffff;
              padding:30px;
            "
          >
            <h2
              style="
                margin-top:0;
                font-size:22px;
              "
            >
              ${escapeHtml(title)}
            </h2>

            <p
              style="
                line-height:1.7;
                color:#444444;
              "
            >
              ${message}
            </p>

            ${content}
          </div>

          <div
            style="
              text-align:center;
              padding:20px;
              color:#777777;
              font-size:12px;
            "
          >
            © ${new Date().getFullYear()} VELNORA
          </div>
        </div>
      </body>
    </html>
  `;
}

async function sendOrderConfirmationEmail(
  order
) {
  if (!order?.customer?.email) {
    return;
  }

  const itemsHtml =
    createItemsHtml(order.items);

  const content = `
    <div
      style="
        margin:24px 0;
        padding:16px;
        background:#f7f7f7;
      "
    >
      <strong>Order ID:</strong>
      ${escapeHtml(order.orderId)}
      <br><br>

      <strong>Payment:</strong>
      ${
        order.paymentMethod === "online"
          ? "Online Payment"
          : "Cash on Delivery"
      }
      <br><br>

      <strong>Status:</strong>
      ${escapeHtml(order.status)}
    </div>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        border-collapse:collapse;
        margin-top:20px;
      "
    >
      <thead>
        <tr>
          <th
            style="
              padding:10px 8px;
              text-align:left;
              border-bottom:2px solid #111111;
            "
          >
            Product
          </th>

          <th
            style="
              padding:10px 8px;
              text-align:center;
              border-bottom:2px solid #111111;
            "
          >
            Qty
          </th>

          <th
            style="
              padding:10px 8px;
              text-align:right;
              border-bottom:2px solid #111111;
            "
          >
            Amount
          </th>
        </tr>
      </thead>

      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div
      style="
        margin-top:22px;
        text-align:right;
        line-height:1.8;
      "
    >
      <div>
        Subtotal:
        ₹${formatMoney(order.subtotal)}
      </div>

      ${
        Number(order.discountAmount || 0) > 0
          ? `
            <div>
              Discount:
              -₹${formatMoney(
                order.discountAmount
              )}
            </div>
          `
          : ""
      }

      <div>
        Shipping:
        ${
          Number(order.shipping || 0) === 0
            ? "Free"
            : `₹${formatMoney(
                order.shipping
              )}`
        }
      </div>

      <div
        style="
          font-size:20px;
          font-weight:bold;
          margin-top:6px;
        "
      >
        Total:
        ₹${formatMoney(order.total)}
      </div>
    </div>

    <div
      style="
        margin-top:25px;
        padding-top:20px;
        border-top:1px solid #eeeeee;
      "
    >
      <strong>Delivery Address</strong>

      <p
        style="
          line-height:1.6;
          color:#555555;
        "
      >
        ${escapeHtml(
          order.customer.name
        )}<br>

        ${escapeHtml(
          order.customer.address
        )}<br>

        ${escapeHtml(
          order.customer.city
        )},
        ${escapeHtml(
          order.customer.state
        )}
        -
        ${escapeHtml(
          order.customer.pincode
        )}<br>

        ${escapeHtml(
          order.customer.phone
        )}
      </p>
    </div>
  `;

  await sendEmail({
    to: order.customer.email,

    subject:
      `Order Confirmed - ${order.orderId} | VELNORA`,

    html: emailLayout({
      title: "Order Confirmed",

      message:
        `Hi ${escapeHtml(
          order.customer.name
        )}, your VELNORA order has been successfully placed.`,

      content,
    }),
  });
}

async function sendCancellationEmail(
  order
) {
  if (!order?.customer?.email) {
    return;
  }

  const online =
    order.paymentMethod === "online";

  await sendEmail({
    to: order.customer.email,

    subject:
      `Order Cancelled - ${order.orderId} | VELNORA`,

    html: emailLayout({
      title: "Order Cancelled",

      message:
        `Hi ${escapeHtml(
          order.customer.name
        )}, your order <strong>${escapeHtml(
          order.orderId
        )}</strong> has been cancelled successfully.`,

      content: `
        <div
          style="
            margin-top:22px;
            padding:18px;
            background:#f7f7f7;
            line-height:1.7;
          "
        >
          <strong>
            Order Total:
          </strong>

          ₹${formatMoney(
            order.total
          )}

          <br>

          <strong>
            Payment Method:
          </strong>

          ${
            online
              ? "Online Payment"
              : "Cash on Delivery"
          }

          ${
            online
              ? `
                <br>

                <strong>
                  Refund Status:
                </strong>

                ${escapeHtml(
                  order.refundStatus ||
                    "Pending"
                )}
              `
              : ""
          }
        </div>
      `,
    }),
  });
}

async function sendRefundEmail(order) {
  if (!order?.customer?.email) {
    return false;
  }

  await sendEmail({
    to: order.customer.email,

    subject:
      `Refund Processed - ${order.orderId} | VELNORA`,

    html: emailLayout({
      title: "Refund Processed",

      message:
        `Hi ${escapeHtml(
          order.customer.name
        )}, your refund for order <strong>${escapeHtml(
          order.orderId
        )}</strong> has been processed successfully.`,

      content: `
        <div
          style="
            margin-top:22px;
            padding:18px;
            background:#f7f7f7;
            line-height:1.7;
          "
        >
          <strong>
            Refund Amount:
          </strong>

          ₹${formatMoney(
            order.refundAmount ||
              order.total
          )}

          <br>

          <strong>
            Refund Status:
          </strong>

          ${escapeHtml(
            order.refundStatus ||
              "Processed"
          )}

          ${
            order.razorpayRefundId
              ? `
                <br>

                <strong>
                  Refund ID:
                </strong>

                ${escapeHtml(
                  order.razorpayRefundId
                )}
              `
              : ""
          }

          <br><br>

          <span
            style="
              color:#555555;
              font-size:14px;
            "
          >
            The refunded amount will be
            credited according to your
            bank or payment provider's
            processing time.
          </span>
        </div>
      `,
    }),
  });

  return true;
}

async function sendOrderStatusEmail(
  order
) {
  if (!order?.customer?.email) {
    return;
  }

  let statusMessage =
    `the status of your order <strong>${escapeHtml(
      order.orderId
    )}</strong> has been updated.`;

  if (order.status === "Processing") {
    statusMessage =
      `your order <strong>${escapeHtml(
        order.orderId
      )}</strong> is now being processed.`;
  }

  if (order.status === "Shipped") {
    statusMessage =
      `your order <strong>${escapeHtml(
        order.orderId
      )}</strong> has been shipped.`;
  }

  if (order.status === "Delivered") {
    statusMessage =
      `your order <strong>${escapeHtml(
        order.orderId
      )}</strong> has been delivered successfully.`;
  }

  await sendEmail({
    to: order.customer.email,

    subject:
      `${order.status} - ${order.orderId} | VELNORA`,

    html: emailLayout({
      title: order.status,

      message:
        `Hi ${escapeHtml(
          order.customer.name
        )}, ${statusMessage}`,

      content: `
        <div
          style="
            margin-top:22px;
            padding:18px;
            background:#f7f7f7;
            line-height:1.7;
          "
        >
          <strong>
            Order ID:
          </strong>

          ${escapeHtml(
            order.orderId
          )}

          <br>

          <strong>
            Current Status:
          </strong>

          ${escapeHtml(
            order.status
          )}
        </div>
      `,
    }),
  });
}

module.exports = {
  sendOrderConfirmationEmail,
  sendCancellationEmail,
  sendRefundEmail,
  sendOrderStatusEmail,
};