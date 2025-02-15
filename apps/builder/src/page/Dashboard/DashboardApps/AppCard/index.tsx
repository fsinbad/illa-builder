import { FC, MouseEvent, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Tag } from "@illa-design/react"
import { Avatar } from "@/illa-public-component/Avatar"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@/illa-public-component/MixpanelUtils/interface"
import { ActionButtonGroup } from "@/page/Dashboard/DashboardApps/AppCard/ActionButtonGroup"
import {
  appNameStyle,
  cardStyle,
  descriptionStyle,
  editedStyle,
  editorAvatarStyle,
  editorContainerStyle,
  footerStyle,
  headerStyle,
  titleInfoStyle,
} from "@/page/Dashboard/DashboardApps/AppCard/style"
import { AppCardActionItem } from "@/page/Dashboard/DashboardApps/AppCardActionItem"
import AppConfigSelect from "@/page/Dashboard/DashboardApps/AppConfigSelect"
import { DashboardApp } from "@/redux/dashboard/apps/dashboardAppState"
import { fromNow } from "@/utils/dayjs"
import { track } from "@/utils/mixpanelHelper"
import { isCloudVersion } from "@/utils/typeHelper"

interface AppCardProps {
  appInfo: DashboardApp
  canEditApp: boolean
}

export const AppCard: FC<AppCardProps> = (props) => {
  const { t } = useTranslation()
  const { appInfo, canEditApp, ...rest } = props
  const { teamIdentifier } = useParams()
  const navigate = useNavigate()

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  const onClickCard = useCallback(() => {
    if (canEditApp) {
      navigate(`/${teamIdentifier}/app/${appInfo.appId}`)
    } else if (appInfo.mainlineVersion !== 0) {
      navigate(`/${teamIdentifier}/deploy/app/${appInfo.appId}`)
    }
  }, [
    appInfo.appId,
    appInfo.mainlineVersion,
    canEditApp,
    navigate,
    teamIdentifier,
  ])

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLDivElement).dataset?.element !== "listItem") return

      if (canEditApp) {
        track(
          ILLA_MIXPANEL_EVENT_TYPE.SHOW,
          ILLA_MIXPANEL_BUILDER_PAGE_NAME.APP,
          { element: "app_edit", parameter5: appInfo.appId },
        )
      }

      if (appInfo.mainlineVersion !== 0) {
        track(
          ILLA_MIXPANEL_EVENT_TYPE.SHOW,
          ILLA_MIXPANEL_BUILDER_PAGE_NAME.APP,
          { element: "app_launch", parameter5: appInfo.appId },
        )
      }
    },
    [canEditApp, appInfo.appId, appInfo.mainlineVersion],
  )

  const editors = useMemo(() => {
    return (
      <div css={editorContainerStyle}>
        {appInfo?.editedBy?.map((editor) =>
          editor ? (
            <Avatar
              key={editor.userID}
              css={editorAvatarStyle}
              avatarUrl={editor.avatar}
              name={editor.nickname}
              id={editor.userID}
            />
          ) : null,
        )}
      </div>
    )
  }, [appInfo?.editedBy])

  return (
    <div
      css={cardStyle}
      onClick={onClickCard}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      <div css={headerStyle}>
        <div css={titleInfoStyle}>
          <div css={appNameStyle}>{appInfo.appName}</div>
          <div css={editedStyle}>
            {t("dashboard.app.edited_time", {
              time: fromNow(appInfo.updatedAt),
              user: appInfo.appActivity.modifier,
            })}
          </div>
          <div className="deployed">
            {appInfo.deployed ? (
              <Tag colorScheme="green" size="small">
                {t("new_dashboard.status.deployed")}
              </Tag>
            ) : (
              <Tag colorScheme="grayBlue" size="small">
                {t("new_dashboard.status.undeploy")}
              </Tag>
            )}
          </div>
        </div>
        <AppCardActionItem
          appId={appInfo.appId}
          canEditApp={canEditApp}
          isDeploy={appInfo.mainlineVersion !== 0}
          onClick={stopPropagation}
        />
      </div>
      <div>
        <div css={descriptionStyle}>
          {appInfo.config.description || t("new_dashboard.desc.no_description")}
        </div>
      </div>
      {isCloudVersion ? (
        <>
          {editors}
          <div css={footerStyle}>
            <div className="public-info" onClick={stopPropagation}>
              <AppConfigSelect
                appId={appInfo.appId}
                isPublic={appInfo.config.public}
                isDeployed={appInfo.deployed}
                canEditApp={canEditApp}
              />
            </div>
            <ActionButtonGroup appInfo={appInfo} canEditApp={canEditApp} />
          </div>
        </>
      ) : (
        <div css={footerStyle}>
          {editors}
          <ActionButtonGroup appInfo={appInfo} canEditApp={canEditApp} />
        </div>
      )}
    </div>
  )
}

AppCard.displayName = "AppCard"
