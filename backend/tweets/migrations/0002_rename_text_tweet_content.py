# Generated by Django 5.1.4 on 2024-12-25 10:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("tweets", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="tweet",
            old_name="text",
            new_name="content",
        ),
    ]
