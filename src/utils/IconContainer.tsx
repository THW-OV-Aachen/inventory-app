const IconContainer = (props: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) => {
    return (
        <div
            style={{
                width: '1.2em',
                height: '1.2em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <props.icon width="100%" height="100%" />
        </div>
    );
};

export default IconContainer;
