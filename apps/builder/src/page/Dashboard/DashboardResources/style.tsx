import { SerializedStyles, css } from "@emotion/react"
import { globalColor, illaPrefix } from "@illa-design/react"
import { contentStyle } from "@/page/Dashboard/DashboardApps/style"

export function applyTableTextStyle(highlight: boolean): SerializedStyles {
  return css`
    font-family: "Helvetica Neue", sans-serif;
    font-size: 14px;
    color: ${highlight
      ? globalColor(`--${illaPrefix}-grayBlue-02`)
      : globalColor(`--${illaPrefix}-grayBlue-04`)};
  `
}

export const resourceNameStyle = css`
  max-width: 312px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const hoverStyle = css`
  overflow: auto;
  min-height: 150px;
  ${contentStyle};

  &::-webkit-scrollbar {
    display: none;
  }

  tr {
    &:hover {
      .dashboardResourceEditButton {
        visibility: visible;
      }
    }
  }
`
