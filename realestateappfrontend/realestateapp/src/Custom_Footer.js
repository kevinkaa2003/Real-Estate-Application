import './Custom_Footer.css';
import { useNavigate } from 'react-router-dom';
import companyLogo from './tokyoguesthouselogo.png';



//Custom Footer Component
const CustomFooter = () => {
    const navigate = useNavigate();
    const goToContact = () => navigate('/Contact');
    const goToHome = () => navigate('/Home');

   
    return (
        <>
        <div className="mainfooter">
            <div className='footerwrapper'>
                <div className='footerlogo'><img src={companyLogo} onClick={() => {
                    goToHome();
                    window.scrollTo(0,0);

                }}/></div>
                <div className="footercontact">
                    <button className="footercontactbtn" onClick={() => {
                        goToContact();
                        window.scrollTo(0,0);
                    }}>Contact Us
                    </button>
                    <div className="footercontactinfo">
                        <br/>
                        <strong>Phone:</strong> 03-6903-7256
                        <br/>
                        <br/>
                        <strong>Address:</strong> 2 Chome-4-17 Takinogawa, Kita City, Tokyo 114-002
                        <br/>
                        <br/>
                        <br/>
                        <div className="footersocialmedia">
                            <a href="#" className="facebookfooter">Facebook</a>
                            <br/>
                            <br/>
                            <a href="#" className="twitterfooter">Twitter</a>
                            <br/>
                            <br/>
                            <a href="#" className="instagramfooter">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className='map'>
                    <label for='officelocation' className='officelocationlabel'>Location</label>
                    <iframe id ='officelocation' loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.9561173225707!2d139.73393631471433!3d35.75188333370238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018927ea4629f13%3A0x54331258d720cb57!2z546L5a2Q44Of44Ol44O844K444OD44Kv44Op44Km44Oz44K4L-adseS6rOOCsuOCueODiOODj-OCpuOCuQ!5e0!3m2!1sja!2sjp!4v1549709802143"></iframe>
                </div>
            </div>
        </div>
        </>
      );
}

export default CustomFooter;
