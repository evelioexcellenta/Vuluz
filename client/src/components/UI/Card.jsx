import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <div className={`card-header ${className}`}>
      {title && (
        <div className="mb-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

const CardBody = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;