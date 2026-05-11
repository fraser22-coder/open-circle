/**
 * Generates a pre-filled vendor agreement HTML string.
 * Known fields (vendor name, contact name, date) are filled in and un-highlighted.
 * Fields we don't have (vendor address, Fraser's last name) remain as yellow placeholders.
 */
export function getVendorAgreementHtml(data: {
  vendorName: string
  contactName: string
}): string {
  const date = new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const filled = (text: string) =>
    `<strong>${text}</strong>`

  const html = CONTRACT_TEMPLATE
    .replace(
      /<span class="placeholder">\[Vendor Business Name\]<\/span>/g,
      filled(data.vendorName)
    )
    .replace(
      /<span class="placeholder">\[Vendor Owner Name\]<\/span>/g,
      filled(data.contactName)
    )
    .replace(
      /<span class="placeholder">\[Date\]<\/span>/g,
      filled(date)
    )

  return html
}

// ── Contract HTML ─────────────────────────────────────────────────────────────

const CONTRACT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Open Circle Markets – Vendor Agreement</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fff;
    padding: 60px 80px;
    max-width: 800px;
    margin: 0 auto;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #1b1f3b;
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  .header .brand {
    font-size: 22pt;
    font-weight: bold;
    color: #1b1f3b;
    letter-spacing: 1px;
    font-family: Arial, sans-serif;
  }
  .header .doc-title {
    font-size: 15pt;
    margin-top: 6px;
    color: #444;
    font-family: Arial, sans-serif;
  }
  .header .version {
    font-size: 9pt;
    color: #888;
    margin-top: 4px;
    font-family: Arial, sans-serif;
  }
  h2 {
    font-family: Arial, sans-serif;
    font-size: 12pt;
    font-weight: bold;
    color: #1b1f3b;
    margin-top: 28px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-left: 3px solid #f9d378;
    padding-left: 10px;
  }
  p { margin-bottom: 10px; }
  .parties-box {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px 24px;
    margin: 20px 0;
  }
  .parties-box p { margin-bottom: 6px; }
  .placeholder {
    background: #fff8dc;
    border: 1px dashed #d4a017;
    border-radius: 3px;
    padding: 1px 6px;
    font-style: italic;
    color: #8a6000;
    font-size: 10pt;
  }
  .signature-block {
    margin-top: 50px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .sig-col {
    border-top: 1px solid #999;
    padding-top: 10px;
  }
  .sig-col p { margin-bottom: 4px; font-size: 10pt; color: #444; }
  .sig-line {
    border-bottom: 1px solid #333;
    height: 36px;
    margin: 14px 0 8px;
  }
  .footer {
    margin-top: 60px;
    text-align: center;
    font-size: 9pt;
    color: #aaa;
    border-top: 1px solid #eee;
    padding-top: 16px;
    font-family: Arial, sans-serif;
  }
  ol { padding-left: 22px; margin-bottom: 10px; }
  ol li { margin-bottom: 6px; }
  .note {
    background: #f0f4ff;
    border-left: 3px solid #1b1f3b;
    padding: 10px 14px;
    font-size: 10pt;
    color: #444;
    margin: 16px 0;
    font-style: italic;
  }
  @media print {
    body { padding: 40px 60px; }
    h2 { page-break-after: avoid; }
    .signature-block { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<div class="header">
  <div class="brand">OPEN CIRCLE MARKETS</div>
  <div class="doc-title">Vendor Agreement</div>
  <div class="version">Version 1.0 &nbsp;|&nbsp; New Zealand</div>
</div>

<div class="parties-box">
  <p><strong>This Vendor Agreement</strong> is entered into between:</p>
  <p><strong>Open Circle Markets</strong> ("OCM", "we", "us"), a business operated by <span class="placeholder">Fraser [Last Name]</span>, Auckland, New Zealand; and</p>
  <p><strong><span class="placeholder">[Vendor Business Name]</span></strong> ("Vendor", "you"), operated by <span class="placeholder">[Vendor Owner Name]</span>, <span class="placeholder">[Vendor Address]</span>.</p>
  <p style="margin-top:12px;"><strong>Effective Date:</strong> <span class="placeholder">[Date]</span></p>
</div>

<div class="note">
  Fields highlighted in yellow are to be completed before signing. Both parties should retain a signed copy.
</div>


<h2>1. Background</h2>
<p>Open Circle Markets operates an online marketplace and event coordination platform connecting vetted vendors with clients seeking food, beverage, and experience services for private and corporate events in Auckland and surrounding regions.</p>
<p>The Vendor wishes to be listed on the OCM platform and participate in events facilitated by OCM. This Agreement sets out the terms on which that relationship operates.</p>


<h2>2. Definitions</h2>
<p><strong>"Platform"</strong> means the Open Circle Markets website and any associated digital channels, including circle.opencirclemarkets.com.</p>
<p><strong>"Event"</strong> means any function, market, private party, or corporate event for which OCM has facilitated a booking involving the Vendor.</p>
<p><strong>"Booking"</strong> means a confirmed engagement where a client has requested the Vendor's services through OCM.</p>
<p><strong>"Commission"</strong> means the fee payable to OCM as described in Section 6.</p>


<h2>3. Nature of Relationship</h2>
<p>The Vendor is an independent contractor. Nothing in this Agreement creates an employment relationship, partnership, joint venture, or agency between OCM and the Vendor. The Vendor is solely responsible for their own taxes, insurance, permits, and compliance obligations.</p>


<h2>4. OCM's Obligations</h2>
<p>OCM agrees to:</p>
<ol>
  <li>List the Vendor's profile on the Platform, subject to OCM's standards and approval;</li>
  <li>Facilitate introductions and bookings between clients and the Vendor;</li>
  <li>Market and promote the Vendor through OCM's channels, at OCM's discretion;</li>
  <li>Communicate booking enquiries and confirmed Events to the Vendor in a timely manner;</li>
  <li>Maintain a professional platform that reflects well on all listed vendors.</li>
</ol>


<h2>5. Vendor's Obligations</h2>
<p>The Vendor agrees to:</p>
<ol>
  <li>Provide accurate, up-to-date information about their products, services, pricing, and availability;</li>
  <li>Honour all confirmed Bookings and attend Events on time and fully prepared;</li>
  <li>Maintain a professional standard of presentation, conduct, and customer service at all times;</li>
  <li>Comply with all applicable New Zealand laws, including the Food Act 2014, the Health and Safety at Work Act 2015, and any local council requirements;</li>
  <li>Hold a current Food Control Plan or National Programme registration where required by law;</li>
  <li>Maintain appropriate public liability insurance (minimum $1,000,000 NZD cover) and provide proof of cover upon request;</li>
  <li>Notify OCM as soon as practicable if they are unable to fulfil a Booking;</li>
  <li>Not engage directly with clients introduced through OCM to circumvent OCM's commission (see Section 6).</li>
</ol>


<h2>6. Fees and Payment</h2>
<p>OCM's service fee structure depends on the type of Event, as set out below. The applicable fee arrangement will be confirmed in writing by OCM at the time of each Booking.</p>

<p><strong>6.1 Catering and Private Events</strong></p>
<p>For catering engagements and private events where OCM is coordinating end-to-end, OCM includes its service fee within the quote issued to the organiser. In this arrangement:</p>
<ol>
  <li>OCM invoices the organiser for the total amount (which includes OCM's service fee);</li>
  <li>The Vendor invoices OCM for their agreed portion of the total;</li>
  <li>OCM remits payment to the Vendor upon receipt of cleared funds from the organiser.</li>
</ol>
<p>The Vendor's agreed amount will be confirmed in writing prior to the Event. The Vendor acknowledges that OCM's service fee is embedded in the organiser's quote and is not an additional charge to the Vendor in this scenario.</p>

<p><strong>6.2 Markets and Selling Events</strong></p>
<p>For market-style or selling events, OCM will charge the Vendor a service fee that reflects the size, expected attendance, and logistical requirements of the Event. This fee will be:</p>
<ol>
  <li>Calculated by OCM on an event-by-event basis;</li>
  <li>Communicated to the Vendor in writing before they accept the opportunity;</li>
  <li>Payable by the Vendor to OCM within 14 days of the invoice date, or as otherwise specified.</li>
</ol>
<p>The Vendor is not obligated to accept any individual opportunity and may decline without penalty. However, once a Booking is confirmed in writing, the service fee becomes payable.</p>

<p><strong>6.3 Direct Engagement</strong></p>
<p>If a client is introduced to the Vendor through OCM and the Vendor subsequently contracts with that client directly — for the same or any future Event — within 12 months of the introduction, the applicable OCM fee remains payable as if the Booking had been made through the Platform.</p>


<h2>7. Booking and Cancellation</h2>
<p><strong>Confirmation:</strong> A Booking is confirmed when both the client and Vendor have agreed on the scope, date, and price, and OCM has communicated written confirmation.</p>
<p><strong>Vendor cancellation:</strong> If the Vendor cancels a confirmed Booking less than 14 days before the Event date without a reason acceptable to OCM, OCM may, at its discretion, suspend or remove the Vendor from the Platform. OCM will not be liable to the Vendor for any loss arising from such a suspension.</p>
<p><strong>Client cancellation:</strong> OCM will communicate any client cancellations to the Vendor as soon as possible. Any deposits or cancellation fees owed to the Vendor by the client are a matter between the Vendor and the client, unless otherwise agreed in writing with OCM.</p>


<h2>8. Intellectual Property and Content</h2>
<p>The Vendor grants OCM a non-exclusive, royalty-free licence to use the Vendor's name, logo, images, menu content, and other materials provided to OCM solely for the purpose of promoting the Vendor on the Platform and in OCM's marketing channels.</p>
<p>The Vendor warrants that they own or have the right to use all content they provide to OCM, and that OCM's use of such content will not infringe any third party's rights.</p>
<p>OCM retains ownership of all Platform content, branding, design, and technology. Nothing in this Agreement transfers any OCM intellectual property to the Vendor.</p>


<h2>9. Exclusivity</h2>
<p>This Agreement is <strong>non-exclusive</strong>. The Vendor is free to operate independently and to participate in other event platforms, markets, or engagements. OCM likewise may engage other vendors providing similar services.</p>


<h2>10. Liability and Indemnity</h2>
<p>OCM is a facilitator only. OCM is not responsible for the quality, safety, or suitability of the Vendor's products or services, and is not liable for any loss, injury, or damage arising from the Vendor's participation in an Event.</p>
<p>The Vendor indemnifies OCM against any claim, loss, cost, or liability arising from: (a) the Vendor's breach of this Agreement; (b) any negligent or wrongful act or omission by the Vendor; or (c) any failure by the Vendor to comply with applicable laws or regulations.</p>
<p>To the maximum extent permitted by law, OCM's total liability to the Vendor under or in connection with this Agreement shall not exceed the total commission received from the Vendor in the 3 months preceding the event giving rise to the claim.</p>


<h2>11. Confidentiality</h2>
<p>Each party agrees to keep confidential any non-public information disclosed by the other party in connection with this Agreement, and not to disclose such information to any third party without the disclosing party's prior written consent — except as required by law.</p>


<h2>12. Term and Termination</h2>
<p>This Agreement commences on the Effective Date and continues until terminated by either party.</p>
<p>Either party may terminate this Agreement by giving 30 days' written notice to the other party.</p>
<p>OCM may terminate this Agreement immediately if the Vendor: (a) materially breaches this Agreement and fails to remedy the breach within 7 days of written notice; (b) engages in conduct that, in OCM's reasonable opinion, damages OCM's reputation; or (c) ceases to hold required permits or insurance.</p>
<p>On termination, the Vendor's listing will be removed from the Platform. Any Bookings already confirmed at the date of termination shall be honoured unless otherwise agreed.</p>


<h2>13. Dispute Resolution</h2>
<p>The parties agree to attempt to resolve any dispute arising from this Agreement in good faith through direct negotiation before taking any formal action.</p>
<p>If a dispute cannot be resolved within 20 business days of one party notifying the other, either party may refer the matter to mediation before a mediator agreed upon by both parties.</p>
<p>Nothing in this clause prevents either party from seeking urgent injunctive or other equitable relief from a court where necessary.</p>


<h2>14. General</h2>
<p><strong>Governing law:</strong> This Agreement is governed by the laws of New Zealand. The parties submit to the non-exclusive jurisdiction of the New Zealand courts.</p>
<p><strong>Entire agreement:</strong> This Agreement constitutes the entire agreement between the parties in relation to its subject matter and supersedes all prior agreements, representations, and understandings.</p>
<p><strong>Amendments:</strong> OCM may update this Agreement from time to time and will provide the Vendor with reasonable notice of material changes. Continued participation on the Platform after such notice constitutes acceptance of the updated terms.</p>
<p><strong>Waiver:</strong> Failure by either party to enforce any provision of this Agreement does not constitute a waiver of that provision.</p>
<p><strong>Severability:</strong> If any provision of this Agreement is found to be unenforceable, it will be severed and the remaining provisions will continue in full force.</p>
<p><strong>GST:</strong> All amounts in this Agreement are exclusive of GST unless stated otherwise. Where GST applies, it will be added at the applicable rate.</p>


<h2>15. Signatures</h2>
<p>By signing below, both parties agree to be bound by the terms of this Vendor Agreement.</p>

<div class="signature-block">
  <div class="sig-col">
    <p><strong>For Open Circle Markets</strong></p>
    <div class="sig-line"></div>
    <p>Signature</p>
    <br>
    <p>Name: <span class="placeholder">Fraser [Last Name]</span></p>
    <p>Title: Director / Founder</p>
    <p>Date: _______________________</p>
  </div>
  <div class="sig-col">
    <p><strong>For the Vendor</strong></p>
    <div class="sig-line"></div>
    <p>Signature</p>
    <br>
    <p>Name: ______________________</p>
    <p>Business: ___________________</p>
    <p>Date: _______________________</p>
  </div>
</div>

<div class="footer">
  Open Circle Markets &nbsp;·&nbsp; Auckland, New Zealand &nbsp;·&nbsp; opencirclemarkets@gmail.com<br>
  This document is a template. OCM recommends having it reviewed by a New Zealand solicitor before use.
</div>

</body>
</html>`
