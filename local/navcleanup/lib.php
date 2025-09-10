<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Conditionally remove "My courses" from navigation for admins
 * ONLY if they are not enrolled in any course (teacher/student role).
 */
function local_navcleanup_extend_navigation(global_navigation $nav) {
    global $USER, $CFG;

    // Only apply for site admins.
    if (!is_siteadmin($USER)) {
        return;
    }

    // Check if admin is enrolled in any course as a user.
    require_once($CFG->libdir . '/enrollib.php');
    $enrolled = enrol_get_all_users_courses($USER->id, true, 'id');

    // If admin is NOT enrolled, hide "My courses" and Dashboard.
    if (empty($enrolled)) {
        if ($node = $nav->find('myhome', navigation_node::TYPE_CUSTOM)) {
            $node->remove();
        }
        if ($node = $nav->find('mycourses', navigation_node::TYPE_CUSTOM)) {
            $node->remove();
        }

        // Flat navigation fallback.
        if ($flat = $nav->get('flatnavigation')) {
            foreach ($flat->get_children_key_list() as $key) {
                $child = $flat->get($key);
                if (!$child) { continue; }
                $url = (string)$child->action;
                if (strpos($url, '/my/') !== false || strpos($url, 'my/courses.php') !== false) {
                    $child->remove();
                }
            }
        }
    }
}