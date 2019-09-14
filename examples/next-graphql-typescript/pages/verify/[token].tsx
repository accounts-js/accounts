import { useRouter } from 'next/router';

const Token = () => {
    const router = useRouter();
    const { token } = router.query;

    return <p>Token: {token}</p>;
};

export default Token;
