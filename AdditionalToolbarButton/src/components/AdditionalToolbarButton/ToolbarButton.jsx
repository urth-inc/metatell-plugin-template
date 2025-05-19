import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import * as styles from "./ToolbarButton.module.scss";

export const presets = [
  "basic",
  "transparent",
  "accept",
  "cancel",
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5",
  "urth-staff-red",
  "urth-staff-green-onclick",
  "urth-staff-blue-onclick",
];

export const types = ["none", "left", "middle", "right"];

export const statusColors = ["recording", "unread", "enabled", "disabled"];

export const ToolbarButton = forwardRef(
  (
    {
      preset,
      className,
      iconContainerClassName,
      children,
      icon,
      label,
      selected,
      large,
      statusColor,
      type,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.toolbarButton,
          styles[preset],
          styles[type],
          { [styles.selected]: selected, [styles.large]: large },
          className,
        )}
        {...rest}
      >
        <div
          className={classNames(
            styles.iconContainer,
            iconContainerClassName,
            styles["status-" + statusColor],
          )}
          aria-hidden="true"
        >
          {icon}
          {children}
        </div>
        {label && <label>{label}</label>}
      </button>
    );
  },
);

ToolbarButton.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.node,
  selected: PropTypes.bool,
  preset: PropTypes.oneOf(presets),
  statusColor: PropTypes.oneOf(statusColors),
  large: PropTypes.bool,
  className: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(types),
};

ToolbarButton.defaultProps = {
  preset: "basic",
};
