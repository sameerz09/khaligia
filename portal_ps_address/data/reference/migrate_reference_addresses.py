import pandas as pd

# Read the Excel file (replace 'your_file.xlsx' with your actual file path)
df = pd.read_excel('ps_addresses.xls')

# Open the output file to write the generated XML
with open('migration_script.xml', 'w', encoding='utf-8') as file:
    # Start of the XML document
    file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    file.write('<data noupdate="1">\n')

    # Initialize the counter for sequential IDs
    counter = 1

    # Iterate through each row in the DataFrame and generate the XML for each record
    for index, row in df.iterrows():
        # Get values from the DataFrame
        name = row['name']
        area = row['area']
        sub_area = row['sub_area']
        delivery_cost = row['delivery_cost']
        # Create the sequential ID
        record_id = f"ps_{counter}"

        # Write the record XML with the country_id field included
        file.write(f'    <record id="{record_id}" model="res.address">\n')
        file.write(f'        <field name="name">{name}</field>\n')
        file.write(f'        <field name="area">{area}</field>\n')
        file.write(f'        <field name="sub_area">{sub_area}</field>\n')
        file.write(f'        <field name="delivery_cost">{delivery_cost}</field>\n')
        file.write(f'        <field name="country_id" ref="base.ps"/>\n')  # This is your added field
        file.write(f'    </record>\n')

        # Increment the counter for the next ID
        counter += 1

    # End of the XML document
    file.write('</data>\n')

print("Migration script generated successfully.")
