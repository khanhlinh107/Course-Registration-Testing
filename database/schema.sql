-- CHÈN DỮ LIỆU MẪU (Tất cả mật khẩu mặc định là '123456' đã mã hóa bcrypt)
-- Tài khoản sinh viên và admin mẫu để Test API/UI nhanh
INSERT INTO User (user_id, username, password, role) VALUES 
(1, 'student1', '$2a$10$vK6f1O2bXvN0Vv6.j1zUeeH1l.WmsrEUpP69D9p.F5yA4bM/Z8w0S', 'student'),
(2, 'student2', '$2a$10$vK6f1O2bXvN0Vv6.j1zUeeH1l.WmsrEUpP69D9p.F5yA4bM/Z8w0S', 'student'),
(3, 'admin1', '$2a$10$vK6f1O2bXvN0Vv6.j1zUeeH1l.WmsrEUpP69D9p.F5yA4bM/Z8w0S', 'admin');

INSERT INTO Student (student_id, user_id, student_code, full_name, email, major) VALUES
(1, 1, 'SV001', 'Nguyen Van A', 'vana@university.edu.vn', 'Information Technology'),
(2, 2, 'SV002', 'Tran Thi B', 'thib@university.edu.vn', 'Software Engineering');

INSERT INTO Admin (admin_id, user_id, full_name) VALUES
(1, 3, 'Dao Minh Admin');

INSERT INTO Semester (semester_id, semester_name, academic_year) VALUES
(1, 'Semester 1', '2025-2026'),
(2, 'Semester 2', '2025-2026');

INSERT INTO Course (course_id, course_code, course_name, credits, max_students, semester_id) VALUES
(1, 'IT001', 'Software Testing', 3, 2, 1), -- cấu hình max 2 sinh viên để test lỗi full slot
(2, 'IT002', 'Web Development', 4, 40, 1),
(3, 'IT003', 'Database Systems', 3, 30, 1);

INSERT INTO TimeSlot (timeslot_id, course_id, day_of_week, start_time, end_time, room) VALUES
(1, 1, 'Monday', '07:30:00', '10:00:00', 'Lab 401'),
(2, 2, 'Monday', '08:30:00', '11:00:00', 'Lab 402'), -- Trùng khung giờ Thứ 2 với IT001 để test nghiệp vụ trùng lịch
(3, 3, 'Wednesday', '13:30:00', '16:00:00', 'Hall A');