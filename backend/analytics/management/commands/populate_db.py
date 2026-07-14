from django.core.management.base import BaseCommand
from analytics.models import AnalyticsRecord, Annotation
from faker import Faker
import random
from datetime import timedelta, date

class Command(BaseCommand):
    help = 'Populates the database with 50,000 analytics records'

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Toys']
        statuses = ['Active', 'Paused', 'Archived']
        device_types = ['Desktop', 'Mobile', 'Tablet']
        source_types = ['Organic', 'Paid', 'Direct', 'Referral']
        
        self.stdout.write("Deleting old records...")
        AnalyticsRecord.objects.all().delete()
        Annotation.objects.all().delete()
        
        records = []
        start_date = date(2026, 1, 1)
        
        self.stdout.write("Generating 50,000 records...")
        for i in range(50000):
            # Generate dates over a 1 year span
            record_date = start_date + timedelta(days=random.randint(0, 365))
            search_volume = random.randint(100, 10000)
            clicks = random.randint(0, int(search_volume * 0.5))
            ctr = (clicks / search_volume) * 100 if search_volume > 0 else 0
            rank = round(random.uniform(1.0, 100.0), 1)
            
            records.append(AnalyticsRecord(
                date=record_date,
                keyword=fake.word() + " " + fake.word(),
                category=random.choice(categories),
                status=random.choice(statuses),
                device_type=random.choice(device_types),
                source_type=random.choice(source_types),
                search_volume=search_volume,
                clicks=clicks,
                ctr=round(ctr, 2),
                rank=rank
            ))
            
            if len(records) >= 5000:
                AnalyticsRecord.objects.bulk_create(records)
                records = []
                self.stdout.write(f"Inserted {i+1} records...")
                
        if records:
            AnalyticsRecord.objects.bulk_create(records)
            
        self.stdout.write("Generating some annotations...")
        annotations = [
            Annotation(date=start_date + timedelta(days=30), title="Google Algorithm Update", description="Major core update rollout."),
            Annotation(date=start_date + timedelta(days=90), title="SEO Campaign Launch", description="Started new content marketing campaign."),
            Annotation(date=start_date + timedelta(days=150), title="Website Migration", description="Moved to new domain, expected turbulence."),
            Annotation(date=start_date + timedelta(days=220), title="Product Launch", description="Launched V2 of the product.")
        ]
        Annotation.objects.bulk_create(annotations)
            
        self.stdout.write(self.style.SUCCESS("Successfully populated the database!"))
