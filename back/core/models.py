from django.db import models
from django.contrib.auth.models import AbstractUser


class UserManager(models.Manager):
    def create(self, **kwargs):
        user = self.model(
            profile=UserProfile.objects.create(),
            settings=UserSetting.objects.create(),
            **kwargs,
        )
        user.save(using=self._db)


class User(AbstractUser):
    show_second_name = models.BooleanField(default=False)

    profile = models.OneToOneField(
        'UserProfile', on_delete=models.CASCADE)
    settings = models.OneToOneField(
        'UserSetting', on_delete=models.CASCADE)


class UserProfile(models.Model):
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)


class UserSetting(models.Model):

    show_second_name = models.BooleanField(default=False)
