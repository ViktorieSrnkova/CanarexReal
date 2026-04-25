import "../../styles/contact/medalion.css";
import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
type Props = {
  name: string;
  role: string;
  phoneMain: string;
  phoneSecondary?: string;
  email: string;
  image: string;
  alt: string;
  flagPath: string[];
  flagAlts: string[];
};

function Medalion(props: Props) {
  return (
    <div className="medalion-wrapper">
      <div className="medalion-graphic">
        <div className="medalion-blue-pettal">
          <img
            src={props.image}
            alt={props.alt}
            loading="eager"
            width={200}
            height={240}
            fetchPriority="high"
          />

          <div className="medalion-person">
            <p className="medalion-name">{props.name}</p>
            <hr className="medalion-hr" />
            <div className="medalion-role">{props.role}</div>
          </div>
        </div>
      </div>
      <div className="medalion-info-wrapper">
        <div className="medalion-first-row">
          <div className="marginless number phone">
            <img src={props.flagPath[0]} alt={props.flagAlts[0]} />
            <img src={Phone} alt="phone icon" />
            {props.phoneMain}
          </div>
          {props.phoneSecondary && (
            <div className="marginless number phone">
              <img src={props.flagPath[1]} alt={props.flagAlts[1]} />
              <img src={Phone} alt="phone icon" />
              {props.phoneSecondary}
            </div>
          )}
        </div>
        <div className="medalion-second-row">
          <a className="mail marginless" href={`mailto:${props.email}`}>
            <img src={Mail} alt="mail icon" />
            {props.email}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Medalion;
