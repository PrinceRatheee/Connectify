import { TailSpin } from "react-loader-spinner";
const Loader = ({height='80',width='80',color='#1476ff'}) => {
    return (
        <TailSpin
            height={height}
            width={width}
            color={color}
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    )
}

export default Loader