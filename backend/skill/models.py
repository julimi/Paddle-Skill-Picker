from django.db import models

# Create your models here.
class Skill(models.Model):
    
    id = models.AutoField(primary_key=True, db_column='id', verbose_name='ID')
    title = models.CharField(max_length=150, db_column='title', verbose_name='Title')

    class Meta:
        db_table = 'tb_skill'

    def __str__(self):
        return str(self.title)