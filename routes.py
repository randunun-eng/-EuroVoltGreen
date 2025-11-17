import uuid
import logging
from flask import render_template, request, jsonify, flash, redirect, url_for, session
from app import app, db
from models import ContactInquiry, ChatMessage
from forms import ContactForm, ChatForm
from openai_service import get_solar_advice, analyze_solar_inquiry
from translations import get_translation, translations

@app.context_processor
def inject_translations():
    """Make translations available in all templates"""
    return dict(translations=translations, get_translation=get_translation)

@app.route('/')
def index():
    language = request.args.get('lang', 'en')
    return render_template('index.html', language=language)

@app.route('/about')
def about():
    language = request.args.get('lang', 'en')
    return render_template('about.html', language=language)

@app.route('/products')
def products():
    language = request.args.get('lang', 'en')
    
    # Hybrid Inverters (MEGA, MEGA-ECO, MAGIC series)
    hybrid_inverters = [
        {
            'name': 'MEGA-6KW',
            'power': '6KVA/6KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '50-450Vdc',
            'features': ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            'warranty': '5 years',
            'price': '$377',
            'dimensions': '521x470x236mm',
            'weight': '30kg'
        },
        {
            'name': 'MEGA-8KW',
            'power': '8KVA/8KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '50-450Vdc',
            'features': ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            'warranty': '5 years',
            'dimensions': '500x483x260mm',
            'weight': '38kg'
        },
        {
            'name': 'MEGA-10KW',
            'power': '10KVA/10KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '50-450Vdc',
            'features': ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            'warranty': '5 years',
            'dimensions': '500x483x260mm',
            'weight': '42kg'
        },
        {
            'name': 'MAGIC-10KW',
            'power': '10KVA/10KW',
            'voltage': '230VAC/400VAC (3-Phase)',
            'efficiency': '97%',
            'mppt_range': '200-800Vdc',
            'features': ['3-Phase In/Out', '3 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Operation'],
            'warranty': '5 years',
            'weight': '48kg'
        },
        {
            'name': 'MAGIC-12KW',
            'power': '12KVA/12KW',
            'voltage': '230VAC/400VAC (3-Phase)',
            'efficiency': '97%',
            'mppt_range': '200-800Vdc',
            'features': ['3-Phase In/Out', '3 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Operation'],
            'warranty': '5 years',
            'weight': '52kg'
        }
    ]
    
    # On-grid Inverters (MATE series)
    ongrid_inverters = [
        {
            'name': 'MATE-3KW',
            'power': '3KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Grid-Tie Ready'],
            'warranty': '5 years',
            'certifications': ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            'name': 'MATE-6KW',
            'power': '6KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97.3%',
            'mppt_range': '60-450Vdc',
            'features': ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Dual MPPT'],
            'warranty': '5 years',
            'certifications': ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            'name': 'MATE-10KW',
            'power': '10KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Triple MPPT'],
            'warranty': '5 years',
            'certifications': ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            'name': 'MATE-15KW',
            'power': '15KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Quad MPPT'],
            'warranty': '5 years',
            'certifications': ['IEC/62109-1/2', 'IEC 61000-1/3']
        }
    ]
    
    # Off-grid Inverters (META, PV series)
    offgrid_inverters = [
        {
            'name': 'META-4KW',
            'power': '4KVA/4KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Motor Capacity', 'WiFi Monitoring', 'Pure Sine Wave', 'UPS Function'],
            'warranty': '2 years',
            'dimensions': '300x278x106mm',
            'weight': '4.92kg'
        },
        {
            'name': 'META-6KW',
            'power': '6KVA/6KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Motor Capacity', 'WiFi Monitoring', 'Dual MPPT', 'UPS Function'],
            'warranty': '2 years',
            'price': '$85',
            'dimensions': '316.8x310.6x107.3mm',
            'weight': '5.69kg'
        },
        {
            'name': 'META-10KW',
            'power': '10KVA/10KW',
            'voltage': '220/230/240VAC',
            'efficiency': '97%',
            'mppt_range': '60-450Vdc',
            'features': ['High Motor Capacity', 'WiFi Monitoring', 'Triple MPPT', 'UPS Function'],
            'warranty': '2 years',
            'price': '$112',
            'dimensions': '300x278x106mm',
            'weight': '4.5kg'
        },
        {
            'name': 'PV5000-24L',
            'power': '5KVA',
            'voltage': '208/220/230/240VAC',
            'features': ['Built-in 100A Solar Charger', 'Wide MPPT Range 40-500V', 'Generator Compatible', 'WiFi Monitoring'],
            'certifications': ['CE'],
            'weight': '64kg'
        },
        {
            'name': 'PV9000-24 S5.0',
            'power': '5KVA',
            'voltage': '220/230/240VAC',
            'features': ['Built-in 160A Solar Charger', 'Wide PV Range 60-500V', 'Dual AC Output', 'Feed-in to Grid'],
            'weight': '8.4kg'
        }
    ]
    
    # MPPT Solar Charge Controllers
    mppt_controllers = [
        {
            'name': 'EV-MPPT-30A',
            'current': '30A',
            'voltage': '12V/24V',
            'efficiency': '99.5%',
            'mppt_range': '60-150Vdc',
            'features': ['Auto Recognition', 'Temperature Compensation', 'USB Monitoring', 'LCD Display'],
            'warranty': '5 years'
        },
        {
            'name': 'EV-MPPT-60A',
            'current': '60A',
            'voltage': '12V/24V',
            'efficiency': '99.5%',
            'mppt_range': '60-150Vdc',
            'features': ['Auto Recognition', 'Temperature Compensation', 'USB Monitoring', 'Bluetooth'],
            'warranty': '5 years'
        },
        {
            'name': 'EV-MPPT-100A',
            'current': '100A',
            'voltage': '12V/24V/48V',
            'efficiency': '99.7%',
            'mppt_range': '60-150Vdc',
            'features': ['Bluetooth', 'App Control', 'Data Logging', 'Advanced MPPT Algorithm'],
            'warranty': '5 years'
        },
        {
            'name': 'EV-MPPT-150A',
            'current': '150A',
            'voltage': '12V/24V/48V',
            'efficiency': '99.8%',
            'mppt_range': '60-200Vdc',
            'features': ['WiFi Monitoring', 'Cloud Connectivity', 'Advanced Analytics', 'Smart Scheduling'],
            'warranty': '5 years'
        }
    ]
    
    # PWM Solar Charge Controllers
    pwm_controllers = [
        {
            'name': 'EV-PWM-10A',
            'current': '10A',
            'voltage': '12V/24V',
            'features': ['LED Display', 'Overcharge Protection', 'Short Circuit Protection', 'Load Control'],
            'warranty': '3 years'
        },
        {
            'name': 'EV-PWM-20A',
            'current': '20A',
            'voltage': '12V/24V',
            'features': ['LCD Display', 'USB Output', 'Timer Control', 'Temperature Compensation'],
            'warranty': '3 years'
        },
        {
            'name': 'EV-PWM-30A',
            'current': '30A',
            'voltage': '12V/24V',
            'features': ['LED Display', 'Overcharge Protection', 'Timer Control', 'Manual Control'],
            'warranty': '3 years'
        },
        {
            'name': 'EV-PWM-50A',
            'current': '50A',
            'voltage': '12V/24V',
            'features': ['LCD Display', 'USB Output', 'Load Control', 'Data Logging'],
            'warranty': '3 years'
        },
        {
            'name': 'EV-PWM-60A',
            'current': '60A',
            'voltage': '12V/24V/48V',
            'features': ['Large LCD Display', 'Dual USB Output', 'Remote Monitoring', 'Programmable Settings'],
            'warranty': '3 years'
        }
    ]
    
    return render_template('products.html', 
                         language=language,
                         hybrid_inverters=hybrid_inverters,
                         ongrid_inverters=ongrid_inverters,
                         offgrid_inverters=offgrid_inverters,
                         mppt_controllers=mppt_controllers,
                         pwm_controllers=pwm_controllers)

@app.route('/roadmap')
def roadmap():
    language = request.args.get('lang', 'en')
    
    roadmap_data = [
        {
            'year': 2020,
            'title': 'Foundation & Technology Base',
            'achievements': [
                'Established R&D center in Shenzhen',
                'Launched first MPPT controller series',
                'Partnership with NEXT Solar',
                'ISO 9001 certification achieved'
            ]
        },
        {
            'year': 2021,
            'title': 'Product Expansion',
            'achievements': [
                'Introduced hybrid inverter line',
                'Collaboration with POWMr and SUMRy',
                'Expanded manufacturing capacity by 200%',
                'CE and UL certifications obtained'
            ]
        },
        {
            'year': 2022,
            'title': 'Innovation & Quality',
            'achievements': [
                'Smart monitoring systems integrated',
                'Partnership with EASUN and MUST',
                'Advanced testing laboratory established',
                'Energy storage solutions developed'
            ]
        },
        {
            'year': 2023,
            'title': 'Global Expansion',
            'achievements': [
                'International distribution network',
                'ANERN strategic partnership',
                'AI-powered monitoring platform',
                'Sustainable manufacturing practices'
            ]
        },
        {
            'year': 2024,
            'title': 'Digital Transformation',
            'achievements': [
                'IoT-enabled product ecosystem',
                'Cloud-based monitoring platform',
                'Advanced battery management systems',
                'Industry 4.0 manufacturing upgrade'
            ]
        },
        {
            'year': 2025,
            'title': 'Future Technologies',
            'goals': [
                'Next-generation inverter technology',
                'Solid-state battery integration',
                'AI-optimized energy management',
                'Carbon-neutral manufacturing'
            ]
        }
    ]
    
    return render_template('roadmap.html', language=language, roadmap_data=roadmap_data)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    language = request.args.get('lang', 'en')
    form = ContactForm()
    
    if form.validate_on_submit():
        try:
            # Save contact inquiry to database
            inquiry = ContactInquiry()
            inquiry.name = form.name.data
            inquiry.email = form.email.data
            inquiry.company = form.company.data
            inquiry.phone = form.phone.data
            inquiry.subject = form.subject.data
            inquiry.message = form.message.data
            inquiry.language = form.language.data
            db.session.add(inquiry)
            db.session.commit()
            
            flash('Your inquiry has been submitted successfully. We will contact you soon!', 'success')
            return redirect(url_for('contact', lang=language))
            
        except Exception as e:
            logging.error(f"Error saving contact inquiry: {e}")
            flash('There was an error submitting your inquiry. Please try again.', 'error')
    
    return render_template('contact.html', language=language, form=form)

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chatbot conversations"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create session ID
        if 'chat_session_id' not in session:
            session['chat_session_id'] = str(uuid.uuid4())
        
        session_id = session['chat_session_id']
        
        # Get response from OpenRouter
        bot_response = get_solar_advice(message, language)
        
        # Save chat message to database
        chat_message = ChatMessage()
        chat_message.session_id = session_id
        chat_message.user_message = message
        chat_message.bot_response = bot_response
        chat_message.language = language
        db.session.add(chat_message)
        db.session.commit()
        
        return jsonify({
            'response': bot_response,
            'session_id': session_id
        })
        
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Failed to process your message'}), 500

@app.route('/api/products')
def api_products():
    """API endpoint for product data"""
    language = request.args.get('lang', 'en')
    
    products = {
        'hybrid_inverters': [
            {
                'id': 'ev-5000h',
                'name': 'EV-5000H',
                'power': '5kW',
                'voltage': '48V',
                'efficiency': '97.5%',
                'warranty': '5 years',
                'certifications': ['CE', 'UL', 'TUV'],
                'features': ['MPPT Controller', 'LCD Display', 'WiFi Monitoring']
            },
            {
                'id': 'ev-10000h',
                'name': 'EV-10000H',
                'power': '10kW',
                'voltage': '96V',
                'efficiency': '98.2%',
                'warranty': '5 years',
                'certifications': ['CE', 'UL', 'TUV'],
                'features': ['Dual MPPT', 'Touch Screen', 'Remote Monitoring']
            },
            {
                'id': 'ev-15000h',
                'name': 'EV-15000H',
                'power': '15kW',
                'voltage': '192V',
                'efficiency': '98.5%',
                'warranty': '5 years',
                'certifications': ['CE', 'UL', 'TUV'],
                'features': ['Triple MPPT', 'Smart Grid Ready', 'Mobile App']
            }
        ]
    }
    
    return jsonify(products)

@app.errorhandler(404)
def not_found_error(error):
    language = request.args.get('lang', 'en')
    return render_template('404.html', language=language), 404

@app.errorhandler(500)
def internal_error(error):
    language = request.args.get('lang', 'en')
    db.session.rollback()
    return render_template('500.html', language=language), 500
