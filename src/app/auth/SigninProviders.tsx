import { oauthProviders } from "@/auth";
import { OauthButton } from "@/components/OauthButton";

export function SigninProviders(props: { callbackUrl?: string }) {
  const { callbackUrl } = props;
  return (
    <>
      <div className="relative py-5 px-20 text-gray-400">
        <div className="border-b border-gray-200 h-2 mb-2"></div>
        <div className="absolute top-0 left-0 bottom-0 flex justify-center items-center right-0">
          <span className="bg-white text-sm px-3">其他登录方式</span>
        </div>
      </div>
      <div className="flex gap-5 p-2  justify-center">
        {oauthProviders.map((provider) => (
          <OauthButton
            icon={provider.style.logo}
            key={provider.id}
            id={provider.id}
            backgroundColor={provider.style.brandColor}
            name={provider.name}
            callbackUrl={callbackUrl}
          />
        ))}
      </div>
    </>
  );
}
