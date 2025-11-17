from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, EmailField, TelField
from wtforms.validators import DataRequired, Email, Length, Optional

class ContactForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    company = StringField('Company', validators=[Optional(), Length(max=200)])
    phone = TelField('Phone', validators=[Optional(), Length(max=20)])
    subject = SelectField('Subject', choices=[
        ('product_inquiry', 'Product Inquiry'),
        ('oem_odm', 'OEM/ODM Services'),
        ('technical_support', 'Technical Support'),
        ('partnership', 'Partnership Opportunity'),
        ('general', 'General Inquiry')
    ], validators=[DataRequired()])
    message = TextAreaField('Message', validators=[DataRequired(), Length(min=10, max=2000)])
    language = SelectField('Preferred Language', choices=[
        ('en', 'English'),
        ('zh', '中文'),
        ('es', 'Español'),
        ('de', 'Deutsch'),
        ('fr', 'Français')
    ], default='en')

class ChatForm(FlaskForm):
    message = StringField('Message', validators=[DataRequired(), Length(min=1, max=500)])
    language = StringField('Language', default='en')
