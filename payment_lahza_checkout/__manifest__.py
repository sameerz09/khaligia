
{
  "name"                 :  "Payment Lahza Checkout",
  "summary"              :  """lahza checkout payment helps to make payment simple and easy.""",
  "category"             :  "Website",
  "version"              :  "1.0.0",
  "sequence"             :  1,
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "description"          :  """Odoo Lahza checkout""",
  "depends"              :  ['account',
                             'payment',
                             'website_sale',
                            ],
  "data"                 :  [
                             'views/payment_form.xml',
                             'views/payment_template.xml',
                             'data/payment_data.xml',
                            ],
  "demo"                 :  [],
  "images"               :  [],
  "application"          :  True,
  "installable"          :  True,
}
