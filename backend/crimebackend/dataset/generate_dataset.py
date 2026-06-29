import csv
import random
from datetime import datetime, timedelta

crime_types = [
    "Theft",
    "Fraud",
    "Cyber Crime",
    "Robbery",
    "Assault",
    "Kidnapping",
    "Drug Crime",
    "Domestic Violence",
    "Burglary",
    "Financial Crime"
]

locations = [
    "Coimbatore",
    "Chennai",
    "Madurai",
    "Salem",
    "Erode",
    "Trichy",
    "Tiruppur",
    "Vellore"
]

status = [
    "Open",
    "Closed",
    "Under Investigation",
    "Resolved"
]

severity = [
    "Low",
    "Medium",
    "High",
    "Critical"
]

evidence = [
    "CCTV",
    "Fingerprint",
    "Witness",
    "Mobile Data",
    "Bank Records",
    "Email Logs"
]

victim_names = [
    "Ramesh",
    "Suresh",
    "Priya",
    "Kavin",
    "Arjun",
    "Meena",
    "Divya",
    "Vignesh",
    "Rahul",
    "Anitha",
    "Harini",
    "Naveen",
    "Ajay",
    "Deepak",
    "Swetha"
]

offender_names = [
    "Kumar",
    "Raj",
    "Manoj",
    "Vikram",
    "Surya",
    "Prakash",
    "Aravind",
    "Hari",
    "Senthil",
    "Dinesh",
    "Ashok",
    "Gokul",
    "Sarath",
    "Bharath",
    "Madhan"
]

headers = [
    "fir_id",
    "crime_type",
    "title",
    "description",
    "victim_name",
    "victim_age",
    "offender_name",
    "location",
    "date",
    "status",
    "amount_lost",
    "evidence_type",
    "severity",
    "prediction_label"
]

with open("crime_dataset.csv", "w", newline="") as file:

    writer = csv.writer(file)

    writer.writerow(headers)

    for i in range(1, 501):

        crime = random.choice(crime_types)

        victim = random.choice(victim_names)

        offender = random.choice(offender_names)

        city = random.choice(locations)

        state = random.choice(status)

        level = random.choice(severity)

        proof = random.choice(evidence)

        age = random.randint(18, 60)

        amount = random.randint(1000, 500000)

        prediction = random.choice([
            "Solved",
            "Unsolved"
        ])

        date = datetime.now() - timedelta(
            days=random.randint(1, 365)
        )

        writer.writerow([

            f"FIR{i:03}",

            crime,

            crime + " Case",

            crime + " reported in " + city,

            victim,

            age,

            offender,

            city,

            date.strftime("%Y-%m-%d"),

            state,

            amount,

            proof,

            level,

            prediction

        ])

print("Dataset created successfully!")